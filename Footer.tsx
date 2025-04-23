export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>Canawide</h5>
            <p className="mb-0">Connecting blue-collar workers with opportunities across Canada.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="mb-2">
              <a href="#" className="text-light me-3">About Us</a>
              <a href="#" className="text-light me-3">Contact</a>
              <a href="#" className="text-light">Privacy Policy</a>
            </div>
            <p className="mb-0">&copy; {new Date().getFullYear()} Canawide. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}