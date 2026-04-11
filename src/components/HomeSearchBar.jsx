import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { PATH } from "../routes/path";
import "./HomeSearchBar.css";

export default function HomeSearchBar({ products = [] }) {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);

  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return [];

    const ranked = products
      .map((p) => {
        const name = (p?.name ?? "").toLowerCase();
        const cat = (p?.category?.name ?? "").toLowerCase();
        const desc = (p?.description ?? "").toLowerCase();
        const haystack = `${name} ${cat} ${desc}`.trim();

        let score = 0;
        if (name.startsWith(q)) score += 3;
        if (cat.startsWith(q)) score += 2;
        if (haystack.includes(q)) score += 1;
        return { p, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((x) => x.p);

    return ranked;
  }, [products, value]);

  useEffect(() => {
    if (!open) setActiveIndex(-1);
  }, [open]);

  const goSearch = (q) => {
    const cleaned = q.trim();
    if (!cleaned) return;
    navigate(`${PATH.search}?q=${encodeURIComponent(cleaned)}`);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      goSearch(suggestions[activeIndex].name);
      setOpen(false);
      return;
    }
    goSearch(value);
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }

    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur?.();
      return;
    }

    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((idx) => Math.min(idx + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((idx) => Math.max(idx - 1, -1));
    }
  };

  return (
    <div className="home-search">
      <form className="home-search__form" onSubmit={onSubmit}>
        <label className="home-search__label" htmlFor="home-search-input">
          Tìm kiếm sản phẩm
        </label>
        <div className="home-search__control">
          <input
            id="home-search-input"
            ref={inputRef}
            className="home-search__input"
            placeholder="Tìm kiếm theo tên hoa, danh mục hoa..."
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => {
              // allow click on suggestion
              setTimeout(() => setOpen(false), 120);
            }}
            onKeyDown={onKeyDown}
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls="home-search-listbox"
          />
          <button className="home-search__btn" type="submit" aria-label="search">
            <FiSearch />
          </button>
        </div>
      </form>

      {open && value.trim() && (
        <div className="home-search__popover" role="dialog" aria-label="Gợi ý tìm kiếm">
          {suggestions.length === 0 ? (
            <div className="home-search__empty">
              Không có gợi ý. Nhấn Enter để tìm “{value.trim()}”.
            </div>
          ) : (
            <ul id="home-search-listbox" className="home-search__list" role="listbox">
              {suggestions.map((p, idx) => (
                <li key={p.id ?? `${p.name}-${idx}`} role="option" aria-selected={idx === activeIndex}>
                  <button
                    type="button"
                    className={`home-search__item ${idx === activeIndex ? "is-active" : ""}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      goSearch(p.name);
                      setOpen(false);
                    }}
                  >
                    <span className="home-search__itemName">{p.name}</span>
                    {p.category?.name ? (
                      <span className="home-search__itemMeta">{p.category.name}</span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

