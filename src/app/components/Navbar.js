export default function Navbar() {
    return (
      <nav className="p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="text-xl font-bold">
            Birthday Website
          </a>
          <div className="space-x-4">
            <a href="/" className="hover:text-blue-500">Home</a>
            <a href="/create-room" className="hover:text-blue-500">Create Room</a>
            <a href="/make-my-weekend" className="hover:text-blue-500">Make My Weekend</a>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Login
            </button>
          </div>
        </div>
      </nav>
    );
  }