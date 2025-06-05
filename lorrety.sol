// SPDX-License-Identifier: MIT
// chạy bằng https://remix.ethereum.org/
pragma solidity ^0.8.0;

contract Lottery {
    struct NguoiChoi {
        string ma;
        string ten;
        address diaChi;
        uint[] cacSo;
    }

    mapping(string => NguoiChoi) public nguoiChoiTheoMa;
    string[] public danhSachMa;
    mapping(uint => string[]) public danhSachNguoiMuaSo;

    string public maNguoiThang;
    string public tenNguoiThang;
    address public diaChiNguoiThang;
    uint public soTrung;
    bool public daQuay;
    address public quanLy;

    constructor() {
        quanLy = msg.sender;
        daQuay = false;
    }

    modifier chiQuanLy() {
        require(msg.sender == quanLy, "Chi quan ly");
        _;
    }

    function muaVe(string memory ten, uint so) public {
        require(!daQuay, "Da quay roi");
        require(so < 100, "So tu 0-99");

        string memory ma = string(abi.encodePacked(ten, "_", toAsciiString(msg.sender)));

        if (bytes(nguoiChoiTheoMa[ma].ten).length == 0) {
            nguoiChoiTheoMa[ma] = NguoiChoi({
                ma: ma,
                ten: ten,
                diaChi: msg.sender,
                cacSo: new uint[](0)
            });
            danhSachMa.push(ma);
        }

        nguoiChoiTheoMa[ma].cacSo.push(so);
        danhSachNguoiMuaSo[so].push(ma);
    }

    function xemDanhSachNguoiChoi() public view returns (NguoiChoi[] memory) {
        NguoiChoi[] memory result = new NguoiChoi[](danhSachMa.length);
        for (uint i = 0; i < danhSachMa.length; i++) {
            result[i] = nguoiChoiTheoMa[danhSachMa[i]];
        }
        return result;
    }

    function quayXoSoTheoSo(uint soChon) public chiQuanLy {
        require(!daQuay, "Da quay roi");
        require(soChon < 100, "So tu 0-99");

        daQuay = true;
        soTrung = soChon;

        string[] memory danhSach = danhSachNguoiMuaSo[soTrung];

        if (danhSach.length > 0) {
            uint index = uint(keccak256(abi.encodePacked(block.timestamp))) % danhSach.length;
            string memory maThang = danhSach[index];

            maNguoiThang = maThang;
            tenNguoiThang = nguoiChoiTheoMa[maThang].ten;
            diaChiNguoiThang = nguoiChoiTheoMa[maThang].diaChi;
        }
    }

    function resetXoSo() public chiQuanLy {
        delete maNguoiThang;
        delete tenNguoiThang;
        delete diaChiNguoiThang;
        delete soTrung;
        daQuay = false;

        for (uint i = 0; i < danhSachMa.length; i++) {
            delete nguoiChoiTheoMa[danhSachMa[i]];
        }
        delete danhSachMa;

        for (uint i = 0; i < 100; i++) {
            delete danhSachNguoiMuaSo[i];
        }
    }

    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(42);
        s[0] = '0';
        s[1] = 'x';
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2 + 2*i] = char(hi);
            s[3 + 2*i] = char(lo);
        }
        return string(s);
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    function xemNguoiThang() public view returns (address, string memory, string memory) {
        return (diaChiNguoiThang, tenNguoiThang, maNguoiThang);
    }

    function soNguoiChoi() public view returns (uint) {
        return danhSachMa.length;
    }

    function soNguoiMua(uint so) public view returns (string[] memory) {
        return danhSachNguoiMuaSo[so];
    }

    function layMaNguoiChoi(uint index) public view returns (string memory) {
        return danhSachMa[index];
    }

    function quanLyHienTai() public view returns (address) {
        return quanLy;
    }

    // Hàm cho phép bất kỳ ai quay số ngẫu nhiên mà không cần quyền quản lý
    function quayXoSo() public {
        require(!daQuay, "Da quay roi");

        daQuay = true;
        soTrung = uint(
        keccak256(
        abi.encodePacked(
            block.difficulty,
            block.timestamp,
            blockhash(block.number - 1),
            msg.sender
        )
    )
) % 100;


        string[] memory danhSach = danhSachNguoiMuaSo[soTrung];
        if (danhSach.length > 0) {
            uint index = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp))) % danhSach.length;
            string memory maThang = danhSach[index];
            maNguoiThang = maThang;
            tenNguoiThang = nguoiChoiTheoMa[maThang].ten;
            diaChiNguoiThang = nguoiChoiTheoMa[maThang].diaChi;
        }
    }
}
