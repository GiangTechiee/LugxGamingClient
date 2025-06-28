interface EmailConfirmationProps {
  email: string;
  onBackToRegister: () => void;
  onGoToLogin: () => void;
}

export function EmailConfirmation({ email, onBackToRegister, onGoToLogin }: EmailConfirmationProps) {
  return (
    <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl p-8 max-w-md w-full border border-white/30">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Kiểm tra email của bạn
        </h2>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Chúng tôi đã gửi một liên kết xác nhận đến <span className="font-semibold text-gray-800">{email}</span>. 
          Vui lòng kiểm tra hộp thư đến (bao gồm cả thư mục spam) và nhấp vào liên kết để kích hoạt tài khoản của bạn.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={onBackToRegister}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
          >
            Quay lại đăng ký
          </button>
          
          <button
            onClick={onGoToLogin}
            className="w-full bg-transparent border border-gray-300 hover:bg-white/50 text-gray-700 font-medium py-3 px-4 rounded-lg transition duration-200"
          >
            Đến trang đăng nhập
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          Không nhận được email? Kiểm tra thư mục spam hoặc thử đăng ký lại sau vài phút.
        </p>
      </div>
    </div>
  );
}