import React, { useEffect, useRef, useState } from "react";
import "./ChatWidget.css";
import { PATH } from "../../routes/path";

function nowTime() {
  return new Date().toLocaleTimeString();
}

function generateBotReply(text) {
  const t = text.toLowerCase();
  if (t.includes("hello") || t.includes("hi") || t.includes("xin chào") || t.includes("chào")) {
    return { text: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?" };
  }

  if (t.includes("đơn hàng") || t.includes("đơn") || t.includes("order")) {
    if (t.includes("mở") || t.includes("xem") || t.includes("hiển thị")) {
      return { text: "Đang mở trang Lịch Sử Đơn Hàng...", action: "open_orders" };
    }
    return { text: "Bạn có thể xem trang Lịch Sử Đơn Hàng để kiểm tra trạng thái đơn. Muốn tôi mở giúp bạn?" };
  }

  if (t.includes("qr") || t.includes("chuyển khoản") || t.includes("thanh toán")) {
    return { text: "Để thanh toán bằng chuyển khoản, vui lòng quét mã QR trên trang thanh toán hoặc chuyển khoản vào số tài khoản hiển thị." };
  }

  if (t.includes("cảm ơn") || t.includes("thanks") || t.includes("thank")) {
    return { text: "Rất vui được giúp! Nếu còn câu hỏi nào khác, cứ gửi nhé." };
  }

  if (t.includes("giỏ hàng") || t.includes("cart")) {
    return { text: "Bạn có thể vào trang Giỏ Hàng để xem sản phẩm đã thêm. Muốn tôi mở giúp bạn?", action: "open_cart" };
  }

  return { text: `Mình đã nhận: "${text}". Nếu bạn muốn xem đơn hàng, gõ 'xem đơn hàng' hoặc 'mở đơn hàng'.` };
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem("chat_messages");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem("chat_messages", JSON.stringify(messages));
    } catch (e) {
    }
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  function sendMessage(text) {
    if (!text || !text.trim()) return;
    const userMsg = { id: Date.now() + "u", who: "user", text: text.trim(), time: nowTime() };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    setTyping(true);
    setTimeout(() => {
      const reply = generateBotReply(text.trim());
      const botText = reply && reply.text ? reply.text : String(reply || "");
      const botMsg = { id: Date.now() + "b", who: "bot", text: botText, time: nowTime() };
      setMessages((m) => [...m, botMsg]);
      setTyping(false);

      if (reply && reply.action) {
        setTimeout(() => {
          if (reply.action === "open_orders") {
            window.location.href = PATH.orders;
          } else if (reply.action === "open_cart") {
            window.location.href = PATH.cart;
          }
        }, 600);
      }
    }, 700 + Math.min(1500, text.length * 20));
  }

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-panel" role="dialog" aria-label="AI chat">
          <div className="chat-header">
            <div>Trợ lý AI</div>
            <button className="btn-close" onClick={() => setOpen(false)} aria-label="Đóng">✕</button>
          </div>

          <div className="chat-body" ref={listRef}>
            {messages.length === 0 && (
              <div className="chat-empty">Xin chào! Hỏi tôi điều gì về đơn hàng hoặc thanh toán.</div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`chat-msg ${m.who}`}>
                <div className="chat-text">{m.text}</div>
                <div className="chat-time">{m.time}</div>
              </div>
            ))}
            {typing && <div className="chat-typing">Trợ lý đang trả lời...</div>}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage(input);
                }
              }}
              placeholder="Gõ tin nhắn..."
              aria-label="Gõ tin nhắn"
            />
            <button className="btn-send" onClick={() => sendMessage(input)} aria-label="Gửi">Gửi</button>
          </div>
        </div>
      )}

      <button
        className={`chat-toggle ${open ? "open" : ""}`}
        aria-expanded={open}
        aria-label="Mở chat"
        onClick={() => setOpen((v) => !v)}>
        💬
      </button>
    </div>
  );
}
