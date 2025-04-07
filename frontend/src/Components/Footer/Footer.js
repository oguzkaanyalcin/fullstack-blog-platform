import React from "react";

function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-5 w-100">
      <div className="container-fluid text-center">
        <p className="mb-0">© {new Date().getFullYear()} Blog Site. Tüm Hakları Saklıdır.</p>
        <p>
          <a href="/privacy-policy" className="text-white text-decoration-none">
            Gizlilik Politikası
          </a>{" "}
          |{" "}
          <a href="/terms" className="text-white text-decoration-none">
            Kullanım Şartları
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
