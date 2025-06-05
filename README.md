🎯 Xổ Số Blockchain
Hệ thống xổ số phi tập trung trên blockchain Ethereum, cho phép nhiều người chơi tham gia bằng cách mua số từ 00 đến 99. Hệ thống hỗ trợ quay số ngẫu nhiên và chọn người thắng minh bạch.

🚀 Chức năng
✅ Người chơi mua vé bằng cách nhập tên + chọn số từ 00–99.
🎲 Bất kỳ ai cũng có thể quay số may mắn (nếu dùng quayXoSo()).
🎯 Kết quả xổ số được xác định trên blockchain, không thể thay đổi.
📜 Lịch sử quay số được lưu trên trình duyệt (LocalStorage).
🧑‍💼 Admin có thể reset vòng để bắt đầu phiên mới.
🛠️ Công nghệ sử dụng
Solidity (smart contract)
HTML, CSS, JavaScript
Web3.js
MetaMask
Remix IDE / Hardhat (triển khai)
⚙️ Cài đặt & chạy thử
1. Clone dự án
git clone https://github.com/ten-cua-ban/lottery-dapp.git
cd lottery-dapp
2. Mở index.html bằng live server hoặc trình duyệt
💡 Lưu ý: MetaMask phải được cài và kết nối mạng phù hợp với địa chỉ contract.
lottery-dapp/
├── index.html       # Giao diện người dùng
├── app.js           # Logic giao tiếp với contract
├── abi.js           # ABI của contract
├── lottery.sol      # Smart contract Lottery
└── README.md        # Tài liệu
🧪 Triển khai contract
Có thể triển khai bằng Remix IDE hoặc Hardhat.

Ví dụ trong Remix:

Dán lottery.sol

Compile → Deploy → Copy địa chỉ contract

Gán vào contractAddress trong app.js
