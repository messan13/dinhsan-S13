const SanovaIntro = () => {
    return (
        <>
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
        {/* Banner */}
        <div className="w-full h-64 bg-[#527360] flex justify-center items-center text-white text-4xl font-bold">
          <h1>Sanova - Làn da sạch, tự tin mỗi ngày</h1>
        </div>
        <div className="max-w-6xl bg-white shadow-lg rounded-2xl p-8 grid grid-cols-2 gap-6 mt-6">
          {/* Nội dung giới thiệu */}
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">VỀ SANOVA</h1>
            <p className="text-gray-600 text-lg mb-4">
              <strong>Sanova</strong> là thương hiệu chuyên về các sản phẩm chăm sóc da dành cho nam giới. Chúng tôi cam kết mang đến những sản phẩm chất lượng cao, an toàn và hiệu quả.
            </p>
            <p className="text-gray-600 text-lg mb-4">
              Với sứ mệnh giúp phái mạnh có một làn da sạch khỏe, Sanova không ngừng cải tiến công thức và nguyên liệu để đem lại trải nghiệm tốt nhất. Sản phẩm của chúng tôi được nghiên cứu kỹ lưỡng, sử dụng các thành phần thiên nhiên, an toàn cho làn da, mang đến hiệu quả làm sạch sâu và dưỡng ẩm tối ưu.
            </p>
            <p className="text-gray-600 text-lg mb-6">
              Không chỉ là một thương hiệu, Sanova còn là một phong cách sống, giúp nam giới tự tin hơn mỗi ngày. Hãy trải nghiệm sự khác biệt với Sanova và khám phá cách chăm sóc da hiệu quả, đơn giản nhưng tối ưu.
            </p>
          </div>
          {/* Hình ảnh minh họa */}
          <div>
            <img
              src="/upload/banner.jpg"
              alt="Sanova Skincare"
              className="w-full h-auto rounded-lg"
            />
          </div>
          {/* Giá trị cốt lõi và Đội ngũ */}
          <div className="col-span-2 grid grid-cols-2 gap-6 mt-6">
            {/* Giá trị cốt lõi */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">GIÁ TRỊ CỐT LÕI</h2>
              <ul className="text-gray-600 list-disc list-inside mb-6">
                <li>Khách hàng là trọng tâm.</li>
                <li>Cung cấp sản phẩm chất lượng với giá tốt.</li>
                <li>Không ngừng lắng nghe và cải tiến.</li>
                <li>Tận tâm vì sức khỏe làn da của nam giới.</li>
              </ul>
            </div>
            {/* Đội ngũ */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">ĐỘI NGŨ</h2>
              <p className="text-gray-600 mb-4">
                Đội ngũ của Sanova luôn tận tâm và nỗ lực để mang đến sự hài lòng tuyệt đối cho khách hàng. Chúng tôi không chỉ cung cấp sản phẩm mà còn đồng hành cùng khách hàng trên hành trình chăm sóc làn da.
              </p>
            </div>
          </div>
        </div>
      </div>
      </>
    );
};

export default SanovaIntro;
