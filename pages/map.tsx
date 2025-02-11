import React, { useState, useEffect } from "react";

const LocationSelector: React.FC = () => {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  // Load danh sách tỉnh/thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await fetch("https://provinces.open-api.vn/api/");
      const data = await response.json();
      setProvinces(data);
    };

    fetchProvinces();
  }, []);

  // Load danh sách quận/huyện khi tỉnh được chọn
  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        const response = await fetch(
          `https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`
        );
        const data = await response.json();
        setDistricts(data.districts || []);
        setWards([]); // Reset xã/phường
      };

      fetchDistricts();
    }
  }, [selectedProvince]);

  // Load danh sách xã/phường khi huyện được chọn
  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        const response = await fetch(
          `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`
        );
        const data = await response.json();
        setWards(data.wards || []);
      };

      fetchWards();
    }
  }, [selectedDistrict]);

  return (
    <div>
      <h2>Chọn Địa Chỉ</h2>

      {/* Dropdown Tỉnh/Thành phố */}
      <label htmlFor="province">Tỉnh/Thành phố:</label>
      <select
        id="province"
        value={selectedProvince}
        onChange={(e) => setSelectedProvince(e.target.value)}
      >
        <option value="">-- Chọn tỉnh/thành phố --</option>
        {provinces.map((province) => (
          <option key={province.code} value={province.code}>
            {province.name}
          </option>
        ))}
      </select>

      <br />

      {/* Dropdown Quận/Huyện */}
      <label htmlFor="district">Quận/Huyện:</label>
      <select
        id="district"
        value={selectedDistrict}
        onChange={(e) => setSelectedDistrict(e.target.value)}
        disabled={!selectedProvince}
      >
        <option value="">-- Chọn quận/huyện --</option>
        {districts.map((district) => (
          <option key={district.code} value={district.code}>
            {district.name}
          </option>
        ))}
      </select>

      <br />

      {/* Dropdown Xã/Phường */}
      <label htmlFor="ward">Xã/Phường:</label>
      <select id="ward" disabled={!selectedDistrict}>
        <option value="">-- Chọn xã/phường --</option>
        {wards.map((ward) => (
          <option key={ward.code} value={ward.code}>
            {ward.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationSelector;
