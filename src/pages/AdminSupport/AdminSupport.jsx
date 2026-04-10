import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaCheck,
  FaCircleInfo,
  FaPlus,
  FaTriangleExclamation,
  FaXmark,
} from "react-icons/fa6";
import { FaChartBar, FaBox, FaShoppingCart, FaUsers } from "react-icons/fa";
import { PATH } from "../../routes/path";
import "./AdminSupport.css";

const chatUsersMock = [
  {
    id: "u1",
    name: "Nguyễn Minh Anh",
    avatar: "MA",
    online: true,
    lastMessage: "Shop ơi em cần đổi địa chỉ nhận hoa.",
    lastTime: "10:42",
    unread: 2,
  },
  {
    id: "u2",
    name: "Trần Thu Hà",
    avatar: "TH",
    online: false,
    lastMessage: "Hoa nhận được rất đẹp, cảm ơn shop.",
    lastTime: "09:15",
    unread: 0,
  },
  {
    id: "u3",
    name: "Phạm Quốc Bảo",
    avatar: "QB",
    online: true,
    lastMessage: "Đơn của em bị trễ, nhờ shop kiểm tra.",
    lastTime: "08:57",
    unread: 1,
  },
];

const messagesMock = {
  u1: [
    {
      id: "m1",
      sender: "user",
      text: "Shop ơi em cần đổi địa chỉ nhận hoa.",
      time: "10:38",
    },
    {
      id: "m2",
      sender: "admin",
      text: "Dạ bạn gửi giúp mình địa chỉ mới nhé.",
      time: "10:39",
    },
    {
      id: "m3",
      sender: "user",
      text: "Số 12 Nguyễn Trãi, Q1 ạ.",
      time: "10:42",
    },
  ],
  u2: [
    {
      id: "m4",
      sender: "user",
      text: "Hoa nhận được rất đẹp, cảm ơn shop.",
      time: "09:15",
    },
    {
      id: "m5",
      sender: "admin",
      text: "Cảm ơn bạn đã ủng hộ shop.",
      time: "09:16",
    },
  ],
  u3: [
    {
      id: "m6",
      sender: "user",
      text: "Đơn của em bị trễ, nhờ shop kiểm tra.",
      time: "08:57",
    },
    {
      id: "m7",
      sender: "admin",
      text: "Shop đã ưu tiên giao ngay trong 30 phút tới.",
      time: "09:00",
    },
  ],
};

const faqMock = [
  {
    id: "f1",
    title: "Thời gian xử lý đơn hàng trung bình",
    category: "Đơn hàng",
    summary: "Từ 10-20 phút sau khi xác nhận thanh toán thành công.",
    updatedAt: "2026-03-20",
  },
  {
    id: "f2",
    title: "Chính sách đổi/trả hoa",
    category: "Chính sách",
    summary: "Hỗ trợ đổi trong 2 giờ nếu lỗi chất lượng hoặc sai mẫu.",
    updatedAt: "2026-03-19",
  },
  {
    id: "f3",
    title: "Gửi thông báo khuyến mãi cho khách",
    category: "Marketing",
    summary: "Vào mục chiến dịch, chọn tệp khách và lịch gửi.",
    updatedAt: "2026-03-17",
  },
];

const notificationsMock = [
  {
    id: "n1",
    type: "ticket",
    text: "Ticket mới: Khách yêu cầu đổi địa chỉ.",
    time: "2 phút trước",
    read: false,
  },
  {
    id: "n2",
    type: "chat",
    text: "Khách Phạm Quốc Bảo vừa phản hồi chat.",
    time: "10 phút trước",
    read: false,
  },
  {
    id: "n3",
    type: "error",
    text: "Lỗi hệ thống: Payment gateway timeout.",
    time: "20 phút trước",
    read: true,
  },
];

function NotificationBell({ items, open, onToggle, onMarkAllRead, onReadOne }) {
  const unread = items.filter((n) => !n.read).length;
  return (
    <div className="sp-noti-wrap">
      <button type="button" className="sp-noti-btn" onClick={onToggle}>
        <FaBell />
        {unread > 0 ? <span className="sp-noti-badge">{unread}</span> : null}
      </button>
      {open ? (
        <div className="sp-noti-dropdown">
          <div className="sp-noti-head">
            <strong>Thông báo</strong>
            <button type="button" onClick={onMarkAllRead}>
              Đánh dấu tất cả đã đọc
            </button>
          </div>
          <div className="sp-noti-list">
            {items.map((n) => (
              <button
                key={n.id}
                type="button"
                className={`sp-noti-item ${n.read ? "" : "is-unread"}`}
                onClick={() => onReadOne(n.id)}>
                <span className={`sp-noti-icon ${n.type}`}>
                  {n.type === "error" ? (
                    <FaTriangleExclamation />
                  ) : n.type === "chat" ? (
                    <FaCircleInfo />
                  ) : (
                    <FaPlus />
                  )}
                </span>
                <span className="sp-noti-text">
                  <span>{n.text}</span>
                  <small>{n.time}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ChatSidebar({ users, activeUserId, onSelect }) {
  return (
    <aside className="sp-chat-sidebar">
      {users.map((u) => (
        <button
          key={u.id}
          type="button"
          className={`sp-chat-user ${activeUserId === u.id ? "active" : ""}`}
          onClick={() => onSelect(u.id)}>
          <div className="sp-avatar">{u.avatar}</div>
          <div className="sp-chat-user-meta">
            <div className="sp-chat-user-top">
              <strong>{u.name}</strong>
              <small>{u.lastTime}</small>
            </div>
            <div className="sp-chat-user-bottom">
              <span>{u.lastMessage}</span>
              {u.unread > 0 ? <em>{u.unread}</em> : null}
            </div>
            <div className={`sp-status ${u.online ? "online" : "offline"}`}>
              {u.online ? "Online" : "Offline"}
            </div>
          </div>
        </button>
      ))}
    </aside>
  );
}

function ChatWindow({
  user,
  messages,
  inputText,
  onChangeInput,
  onSendMessage,
  quickAnswers,
  onUseQuickAnswer,
}) {
  return (
    <section className="sp-chat-main">
      <header className="sp-chat-head">
        <div>
          <h3>{user.name}</h3>
          <p className={user.online ? "online" : "offline"}>
            {user.online ? "Đang hoạt động" : "Ngoại tuyến"}
          </p>
        </div>
      </header>
      <div className="sp-chat-body">
        <div className="sp-chat-messages">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`sp-bubble-row ${m.sender === "admin" ? "is-admin" : "is-user"}`}>
              <div
                className={`sp-bubble ${m.sender === "admin" ? "admin" : "user"}`}>
                <p>{m.text}</p>
                <small>{m.time}</small>
              </div>
            </div>
          ))}
        </div>
        <aside className="sp-quick-faq">
          <h4>Gợi ý từ FAQ</h4>
          {quickAnswers.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => onUseQuickAnswer(q.summary)}>
              <strong>{q.title}</strong>
              <span>{q.summary}</span>
            </button>
          ))}
        </aside>
      </div>
      <form
        className="sp-chat-input"
        onSubmit={(e) => {
          e.preventDefault();
          onSendMessage();
        }}>
        <input
          value={inputText}
          onChange={(e) => onChangeInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
        />
        <button type="submit">Gửi</button>
      </form>
    </section>
  );
}

function FAQSection({ items, search, onSearch, onCreate, onEdit, onDelete }) {
  return (
    <section className="sp-card">
      <div className="sp-card-head">
        <h3>FAQ / Knowledge Base</h3>
        <div className="sp-card-actions">
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Tìm FAQ..."
          />
          <button type="button" onClick={onCreate}>
            + Thêm bài viết
          </button>
        </div>
      </div>
      <div className="sp-table-wrap">
        <table className="sp-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Category</th>
              <th>Mô tả ngắn</th>
              <th>Cập nhật</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.category}</td>
                <td>{item.summary}</td>
                <td>{item.updatedAt}</td>
                <td className="sp-actions">
                  <button type="button" onClick={() => onEdit(item)}>
                    Sửa
                  </button>
                  <button type="button" onClick={() => onDelete(item.id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SupportSettings({ settings, onChange, onSave, saved }) {
  return (
    <section className="sp-card">
      <h3 className="sp-section-title">Settings / Cấu hình hỗ trợ</h3>
      <div className="sp-settings-form">
        <label>
          SLA response time
          <input
            value={settings.sla}
            onChange={(e) => onChange("sla", e.target.value)}
            placeholder="Ví dụ: 15 phút"
          />
        </label>
        <label>
          Email nhận thông báo
          <input
            value={settings.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="admin-support@beautifulflowers.vn"
          />
        </label>
        <label>
          Auto-reply message
          <textarea
            rows={4}
            value={settings.autoReply}
            onChange={(e) => onChange("autoReply", e.target.value)}
          />
        </label>
      </div>
      <div className="sp-settings-actions">
        <button type="button" onClick={onSave}>
          Lưu cấu hình
        </button>
        {saved ? (
          <span>
            <FaCheck /> Đã lưu
          </span>
        ) : null}
      </div>
    </section>
  );
}

export default function SupportPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("chat");
  const [chatUsers, setChatUsers] = useState(chatUsersMock);
  const [messagesByUser, setMessagesByUser] = useState(messagesMock);
  const [activeUserId, setActiveUserId] = useState(chatUsersMock[0].id);
  const [messageInput, setMessageInput] = useState("");

  const [faqs, setFaqs] = useState(faqMock);
  const [faqSearch, setFaqSearch] = useState("");
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({
    title: "",
    category: "",
    summary: "",
  });

  const [notifications, setNotifications] = useState(notificationsMock);
  const [notiOpen, setNotiOpen] = useState(false);

  const [settings, setSettings] = useState({
    sla: "15 phút",
    email: "admin-support@beautifulflowers.vn",
    autoReply: "Shop đã nhận được yêu cầu, bộ phận CSKH sẽ phản hồi sớm nhất.",
  });
  const [savedSettings, setSavedSettings] = useState(false);

  const activeUser =
    chatUsers.find((u) => u.id === activeUserId) || chatUsers[0];
  const activeMessages = messagesByUser[activeUserId] || [];

  const filteredFaqs = useMemo(() => {
    if (!faqSearch.trim()) return faqs;
    const q = faqSearch.toLowerCase();
    return faqs.filter((f) =>
      [f.title, f.category, f.summary].join(" ").toLowerCase().includes(q),
    );
  }, [faqs, faqSearch]);

  const quickFaqForChat = filteredFaqs.slice(0, 3);

  const handleSelectUser = (userId) => {
    setActiveUserId(userId);
    setChatUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, unread: 0 } : u)),
    );
  };

  const pushUserReplyMock = (userId) => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const t = `${hh}:${mm}`;
    setTimeout(() => {
      setMessagesByUser((prev) => ({
        ...prev,
        [userId]: [
          ...(prev[userId] || []),
          {
            id: `m_${Date.now()}_user`,
            sender: "user",
            text: "Cảm ơn admin, mình đã rõ rồi ạ.",
            time: t,
          },
        ],
      }));
      setChatUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                lastMessage: "Cảm ơn admin, mình đã rõ rồi ạ.",
                lastTime: t,
                unread: activeUserId === userId ? 0 : u.unread + 1,
              }
            : u,
        ),
      );
    }, 1200);
  };

  const handleSendMessage = () => {
    const text = messageInput.trim();
    if (!text) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const t = `${hh}:${mm}`;
    setMessagesByUser((prev) => ({
      ...prev,
      [activeUserId]: [
        ...(prev[activeUserId] || []),
        { id: `m_${Date.now()}_admin`, sender: "admin", text, time: t },
      ],
    }));
    setChatUsers((prev) =>
      prev.map((u) =>
        u.id === activeUserId ? { ...u, lastMessage: text, lastTime: t } : u,
      ),
    );
    setMessageInput("");
    pushUserReplyMock(activeUserId);
  };

  const openCreateFaqModal = () => {
    setEditingFaq(null);
    setFaqForm({ title: "", category: "", summary: "" });
    setFaqModalOpen(true);
  };

  const openEditFaqModal = (faq) => {
    setEditingFaq(faq);
    setFaqForm({
      title: faq.title,
      category: faq.category,
      summary: faq.summary,
    });
    setFaqModalOpen(true);
  };

  const saveFaq = () => {
    if (
      !faqForm.title.trim() ||
      !faqForm.category.trim() ||
      !faqForm.summary.trim()
    )
      return;
    const today = new Date().toISOString().slice(0, 10);
    if (editingFaq) {
      setFaqs((prev) =>
        prev.map((f) =>
          f.id === editingFaq.id ? { ...f, ...faqForm, updatedAt: today } : f,
        ),
      );
    } else {
      setFaqs((prev) => [
        { id: `f_${Date.now()}`, ...faqForm, updatedAt: today },
        ...prev,
      ]);
    }
    setFaqModalOpen(false);
  };

  return (
    <div className="sp-page">
      <header className="sp-header">
        <div>
          <h1>Hỗ trợ</h1>
          <p>Quản lý chat, FAQ và cấu hình hỗ trợ khách hàng.</p>
        </div>
        <NotificationBell
          items={notifications}
          open={notiOpen}
          onToggle={() => setNotiOpen((v) => !v)}
          onMarkAllRead={() =>
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
          }
          onReadOne={(id) =>
            setNotifications((prev) =>
              prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
            )
          }
        />
      </header>

      {/* Admin Navigation Menu */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "30px",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "1200px",
          margin: "0 auto 30px",
          padding: "0 20px",
        }}>
        <button
          type="button"
          style={{
            background: "white",
            border: "2px solid #e26d9e",
            color: "#e26d9e",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "0.95rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#e26d9e";
            e.target.style.color = "white";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "white";
            e.target.style.color = "#e26d9e";
            e.target.style.transform = "translateY(0)";
          }}
          onClick={() => navigate(PATH.adminDashboard)}
          title="Dashboard">
          <FaChartBar style={{ marginRight: "8px" }} /> Dashboard
        </button>
        <button
          type="button"
          style={{
            background: "white",
            border: "2px solid #e26d9e",
            color: "#e26d9e",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "0.95rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#e26d9e";
            e.target.style.color = "white";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "white";
            e.target.style.color = "#e26d9e";
            e.target.style.transform = "translateY(0)";
          }}
          onClick={() => navigate(PATH.adminProducts)}
          title="Quản lý sản phẩm">
          <FaBox style={{ marginRight: "8px" }} /> Sản phẩm
        </button>
        <button
          type="button"
          style={{
            background: "white",
            border: "2px solid #e26d9e",
            color: "#e26d9e",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "0.95rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#e26d9e";
            e.target.style.color = "white";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "white";
            e.target.style.color = "#e26d9e";
            e.target.style.transform = "translateY(0)";
          }}
          onClick={() => navigate(PATH.adminOrders)}
          title="Quản lý đơn hàng">
          <FaShoppingCart style={{ marginRight: "8px" }} /> Đơn hàng
        </button>
        <button
          type="button"
          style={{
            background: "white",
            border: "2px solid #e26d9e",
            color: "#e26d9e",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "0.95rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#e26d9e";
            e.target.style.color = "white";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "white";
            e.target.style.color = "#e26d9e";
            e.target.style.transform = "translateY(0)";
          }}
          onClick={() => navigate(PATH.adminUsers)}
          title="Quản lý người dùng">
          <FaUsers style={{ marginRight: "8px" }} /> Người dùng
        </button>
      </div>

      <div className="sp-tabs">
        {[
          ["chat", "Live Chat"],
          ["faq", "FAQ"],
          ["settings", "Settings"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={activeTab === key ? "active" : ""}
            onClick={() => setActiveTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === "chat" ? (
        <section className="sp-chat-layout sp-card">
          <ChatSidebar
            users={chatUsers}
            activeUserId={activeUserId}
            onSelect={handleSelectUser}
          />
          <ChatWindow
            user={activeUser}
            messages={activeMessages}
            inputText={messageInput}
            onChangeInput={setMessageInput}
            onSendMessage={handleSendMessage}
            quickAnswers={quickFaqForChat}
            onUseQuickAnswer={(text) => setMessageInput(text)}
          />
        </section>
      ) : null}

      {activeTab === "faq" ? (
        <FAQSection
          items={filteredFaqs}
          search={faqSearch}
          onSearch={setFaqSearch}
          onCreate={openCreateFaqModal}
          onEdit={openEditFaqModal}
          onDelete={(id) => setFaqs((prev) => prev.filter((f) => f.id !== id))}
        />
      ) : null}

      {activeTab === "settings" ? (
        <SupportSettings
          settings={settings}
          onChange={(k, v) => setSettings((prev) => ({ ...prev, [k]: v }))}
          onSave={() => {
            setSavedSettings(true);
            setTimeout(() => setSavedSettings(false), 1500);
          }}
          saved={savedSettings}
        />
      ) : null}

      {faqModalOpen ? (
        <div className="sp-modal-backdrop">
          <div className="sp-modal">
            <div className="sp-modal-head">
              <h4>{editingFaq ? "Sửa FAQ" : "Thêm bài viết FAQ"}</h4>
              <button type="button" onClick={() => setFaqModalOpen(false)}>
                <FaXmark />
              </button>
            </div>
            <div className="sp-modal-body">
              <label>
                Tiêu đề
                <input
                  value={faqForm.title}
                  onChange={(e) =>
                    setFaqForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </label>
              <label>
                Category
                <input
                  value={faqForm.category}
                  onChange={(e) =>
                    setFaqForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Mô tả ngắn
                <textarea
                  rows={4}
                  value={faqForm.summary}
                  onChange={(e) =>
                    setFaqForm((prev) => ({ ...prev, summary: e.target.value }))
                  }
                />
              </label>
            </div>
            <div className="sp-modal-foot">
              <button
                type="button"
                className="outline"
                onClick={() => setFaqModalOpen(false)}>
                Hủy
              </button>
              <button type="button" onClick={saveFaq}>
                Lưu
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
