const Container = ({ children }) => (
    <div className="flex items-center bg-blue-800 justify-center min-h-screen bg-gray-500">
        <div className="max-w-md w-full p-8 bg-white border border-gray-300 rounded-lg shadow-md">
            {children}
        </div>
    </div>
);
export default Container