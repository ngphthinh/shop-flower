import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";
import { login } from "../../redux/slices/authSlice";
import { authService } from "../../services/authService";
import getCroppedImg from "../../utils/cropImage";

export default function Profile() {
  const dispatch = useDispatch();
  const { user, token, role } = useSelector((state) => state.auth);

  const initialForm = useMemo(
    () => ({
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      address: user?.address ?? "",
      avatarUrl: user?.avatarUrl ?? "",
    }),
    [user],
  );

  const [form, setForm] = useState(initialForm);
  const [cropSource, setCropSource] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState(null);

  const hasChanges = useMemo(() => {
    return (
      form.name !== initialForm.name ||
      form.email !== initialForm.email ||
      form.phone !== initialForm.phone ||
      form.address !== initialForm.address ||
      form.avatarUrl !== initialForm.avatarUrl
    );
  }, [form, initialForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setForm(initialForm);
    toast.info("Đã hoàn tác thay đổi.");
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập họ tên.");
      return;
    }
    if (!form.email.trim()) {
      toast.error("Vui lòng nhập email.");
      return;
    }

    try {
      const response = await authService.updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        avatarUrl: form.avatarUrl.trim(),
      });

      const updatedUser = {
        ...(user ?? {}),
        ...(response?.user || {}),
        email: form.email.trim(),
      };
      dispatch(login({ user: updatedUser, token, role: updatedUser.role || role }));
      toast.success("Đã lưu thông tin hồ sơ.");
    } catch (error) {
      toast.error(error?.message || "Không thể cập nhật hồ sơ.");
    }
  };

  const handleRefreshProfile = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response?.user) {
        const newUser = response.user;
        dispatch(login({ user: newUser, token, role: newUser.role || role }));
        setForm({
          name: newUser.name || "",
          email: newUser.email || "",
          phone: newUser.phone || "",
          address: newUser.address || "",
          avatarUrl: newUser.avatarUrl || "",
        });
        toast.success("Đã cập nhật hồ sơ mới nhất từ server.");
      } else {
        toast.error("Không nhận được dữ liệu user.");
      }
    } catch (error) {
      toast.error(error?.message || "Không thể tải lại hồ sơ.");
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropSource(reader.result?.toString() || "");
    reader.readAsDataURL(file);
  };

  const uploadCroppedAvatar = async () => {
    if (!cropSource || !croppedPixels) return;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    
    if (!cloudName || cloudName === "your_cloud_name_from_dashboard") {
      toast.error(
        "❌ VITE_CLOUDINARY_CLOUD_NAME sai hoặc chưa cấu hình!\n\n" +
        "1. https://cloudinary.com/console\n" +
        "2. Copy Cloud Name\n" +
        "3. .env: VITE_CLOUDINARY_CLOUD_NAME=...\n" +
        "4. Restart dev server"
      );
      return;
    }

    if (!uploadPreset || uploadPreset === "your_unsigned_upload_preset_name") {
      toast.error(
        "❌ VITE_CLOUDINARY_UPLOAD_PRESET chưa cấu hình!\n\n" +
        "1. Settings → Upload → Add preset\n" +
        "2. Type: Unsigned\n" +
        "3. .env: VITE_CLOUDINARY_UPLOAD_PRESET=..."
      );
      return;
    }

    try {
      const blob = await getCroppedImg(cropSource, croppedPixels);
      const formData = new FormData();
      formData.append("file", blob, "avatar.jpg");
      formData.append("upload_preset", uploadPreset);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const result = await response.json();
      
      if (!response.ok) {
        const errorMessage = result?.error?.message || "Upload thất bại";
        
        if (errorMessage.includes("Unknown")) {
          throw new Error(
            `❌ Cloud Name không hợp lệ!\n\n` +
            `Sửa: https://cloudinary.com/console`
          );
        }
        
        throw new Error(errorMessage);
      }
      
      if (!result.secure_url) {
        throw new Error("Không nhận được URL ảnh từ Cloudinary");
      }

      // Update form immediately to see preview
      const newAvatarUrl = result.secure_url;
      setForm((prev) => ({ ...prev, avatarUrl: newAvatarUrl }));
      
      // Also update Redux state immediately for navbar avatar
      const updatedUser = { ...user, avatarUrl: newAvatarUrl };
      dispatch(login({ user: updatedUser, token, role: updatedUser.role || role }));
      
      // Save to database
      try {
        await authService.updateProfile({ avatarUrl: newAvatarUrl });
        toast.success("✅ Avatar cập nhật và lưu thành công!");
      } catch (saveError) {
        toast.warning("Avatar hiển thị nhưng chưa lưu vào DB. Vui lòng lưu hồ sơ.");
      }
      
      setCropSource("");
    } catch (error) {
      toast.error(error.message || "❌ Không thể upload avatar");
    }
  };

  return (
    <div className="container py-4 py-md-5">
      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="info-card">
            <div className="info-card__header">
              <h1 className="info-card__title">Hồ sơ cá nhân</h1>
            </div>
            <div className="info-card__body">
              <p className="mb-3">
                Cập nhật thông tin để nhận hàng nhanh hơn và hỗ trợ tốt hơn khi
                có vấn đề phát sinh.
              </p>
              <div className="info-callout">
                <h3 className="info-callout__title">Lưu ý</h3>
                <p className="info-callout__text">
                  Email/số điện thoại giúp xác nhận đơn hàng và liên hệ khi giao.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="info-card">
            <div className="info-card__header">
              <h2 className="info-card__title">Thông tin liên hệ</h2>
            </div>
            <div className="info-card__body">
              <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Họ và tên</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Ví dụ: Nguyễn Văn A"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Ví dụ: user@example.com"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Số điện thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Ví dụ: 09xxxxxxxx"
                    inputMode="tel"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Avatar</label>
                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    <img
                      src={
                        form.avatarUrl ||
                        "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
                      }
                      alt="avatar preview"
                      style={{
                        width: "68px",
                        height: "68px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #f0d3e2",
                      }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      style={{ maxWidth: "320px" }}
                      onChange={handleAvatarUpload}
                    />
                  </div>
                  {cropSource && (
                    <div className="mt-3" style={{ width: "100%", maxWidth: "420px" }}>
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "260px",
                          background: "#111",
                          borderRadius: "12px",
                          overflow: "hidden",
                        }}
                      >
                        <Cropper
                          image={cropSource}
                          crop={crop}
                          zoom={zoom}
                          aspect={1}
                          cropShape="round"
                          onCropChange={setCrop}
                          onZoomChange={setZoom}
                          onCropComplete={(_, croppedAreaPixels) =>
                            setCroppedPixels(croppedAreaPixels)
                          }
                        />
                      </div>
                      <div className="d-flex align-items-center gap-2 mt-2">
                        <label className="small mb-0">Zoom</label>
                        <input
                          type="range"
                          min={1}
                          max={3}
                          step={0.1}
                          value={zoom}
                          onChange={(e) => setZoom(Number(e.target.value))}
                        />
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={uploadCroppedAvatar}
                        >
                          Cắt & Upload
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => setCropSource("")}
                        >
                          Huỷ
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Địa chỉ</label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="form-control"
                    rows={3}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành..."
                  />
                </div>

                <div className="col-12 d-flex flex-wrap gap-2 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleRefreshProfile}
                  >
                    Cập nhật từ server
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleReset}
                    disabled={!hasChanges}
                  >
                    Hoàn tác
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleSave}
                    disabled={!hasChanges}
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}