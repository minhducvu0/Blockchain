let contract;
let userAccount;
const contractAddress = "0xE0f7ba015aB9759b65f9157E7774AD1a75Fa49B1";

let nameNguoiChoi = "";
let soVeConLai = 0;
let soDaMua = [];

async function updateAccount() {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  userAccount = accounts[0];
}

async function login() {
  if (!window.ethereum) return alert("⚠️ Cài MetaMask!");
  window.web3 = new Web3(window.ethereum);
  await updateAccount();
  contract = new web3.eth.Contract(abi, contractAddress);
  document.getElementById("veStatus").innerText = "✅ Đã kết nối MetaMask!";

  const quanLy = await contract.methods.quanLy().call();
  if (userAccount.toLowerCase() === quanLy.toLowerCase()) {
    const adminArea = document.createElement("div");
    adminArea.innerHTML = `
      <hr>
      <h3>🧑‍💼 Quản lý</h3>
      <button onclick="reset()">♻️ Reset vòng</button>
    `;
    document.body.appendChild(adminArea);
  }
}

function startBuying() {
  nameNguoiChoi = document.getElementById("nameInput").value.trim();
  const sl = parseInt(document.getElementById("veInput").value.trim());
  if (!nameNguoiChoi || isNaN(sl) || sl <= 0) return alert("⚠️ Nhập đúng tên và số lượng vé");
  soVeConLai = sl;
  soDaMua = [];
  document.getElementById("veStatus").innerText = `🎟️ Còn ${soVeConLai} vé cần ghi số`;
  document.getElementById("daMuaList").innerHTML = "";
}

async function buyTicket() {
  const number = parseInt(document.getElementById("numberInput").value.trim());
  if (isNaN(number) || number < 0 || number > 99) return alert("⚠️ Nhập số từ 00–99");
  if (soVeConLai <= 0) return alert("✅ Bạn đã ghi đủ vé!");
  if (soDaMua.includes(number)) return alert("⚠️ Bạn đã chọn số này rồi!");
  await updateAccount();
  try {
    await contract.methods.muaVe(nameNguoiChoi, number).send({ from: userAccount });
    soDaMua.push(number);
    soVeConLai--;
    document.getElementById("veStatus").innerText =
      soVeConLai > 0 ? `🎟️ Còn ${soVeConLai} vé cần ghi số` : `✅ Đã ghi đủ ${soDaMua.length} vé`;
    const li = document.createElement("li");
    li.innerText = `🎫 Số: ${number.toString().padStart(2, '0')}`;
    document.getElementById("daMuaList").appendChild(li);
  } catch (err) {
    console.error("❌ Lỗi ghi số:", err);
    alert("❌ Không thể ghi số. Chi tiết xem console.");
  }
}

async function listPlayers() {
  try {
    const list = await contract.methods.xemDanhSachNguoiChoi().call();
    const ul = document.getElementById("playerList");
    ul.innerHTML = "";
    list.forEach(p => {
      const soStr = (p.cacSo || []).map(n => n.toString().padStart(2, '0')).join(', ');
      const li = document.createElement("li");
      li.innerText = `👤 ${p.ten} - Mã: ${p.ma} - Số đã mua: [${soStr}]`;
      ul.appendChild(li);
    });
  } catch (err) {
    console.error("❌ Không thể tải danh sách người chơi:", err);
  }
}

async function drawAndSpin() {
  await updateAccount();
  try {
    await contract.methods.quayXoSo().send({ from: userAccount });

    const spinner = document.getElementById("spinner");
    spinner.innerText = "--";
    let current = 0;
    const interval = setInterval(() => {
      spinner.innerText = String(current).padStart(2, "0");
      current = (current + 1) % 100;
    }, 40);

    setTimeout(async () => {
      clearInterval(interval);
      const so = await contract.methods.soTrung().call();
      console.log("🎲 Số random blockchain trả về:", so);
      const [addr, ten, ma] = await contract.methods.xemNguoiThang().call();
      spinner.innerText = String(so).padStart(2, "0");
      const result = document.getElementById("resultText");
      if (addr === "0x0000000000000000000000000000000000000000") {
        result.innerText = `❌ Không có người thắng`;
      } else {
        result.innerText = `🎉 Người thắng: ${ten} (${ma})`;
      }
      const history = JSON.parse(localStorage.getItem("lichSu") || "[]");
      history.unshift({ so, ten, ma, thoiGian: new Date().toLocaleString() });
      localStorage.setItem("lichSu", JSON.stringify(history));
    }, 3000);
  } catch (err) {
    alert("❌ Không thể quay số");
    console.error(err);
  }
}

function xemLichSu() {
  const history = JSON.parse(localStorage.getItem("lichSu") || "[]");
  const ul = document.getElementById("historyList");
  ul.innerHTML = "";
  history.forEach(item => {
    const li = document.createElement("li");
    li.innerText = `🕒 ${item.thoiGian} – Số: ${item.so.padStart(2, "0")} – ${item.ten || "Không ai trúng"} (${item.ma || "-"})`;
    ul.appendChild(li);
  });
}

async function reset() {
  await updateAccount();
  try {
    await contract.methods.resetXoSo().send({ from: userAccount });
    alert("♻️ Đã reset vòng quay!");
  } catch (err) {
    alert("❌ Reset thất bại!");
  }
}

window.addEventListener("load", login);
