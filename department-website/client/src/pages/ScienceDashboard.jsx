import React, { useState } from 'react';
import scienceData from '../data/scienceData';

const ScienceDashboard = () => {
  const [data, setData] = useState(scienceData);

  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

  const calculateTotal = (row) =>
    Number(row.الالتزام || 0) +
    Number(row.الجودة || 0) +
    Number(row.النشاط || 0) +
    Number(row.المعاملة || 0);

  const mainStaff = data.filter(item =>
    item.title.includes('أستاذ') || item.title === 'مدرس'
  );

  const assistantStaff = data.filter(item =>
    item.title.includes('مساعد') || item.title.includes('معيد')
  );

  const getGroupTotal = (group) =>
    group.reduce((sum, item) => sum + calculateTotal(item), 0);

  const renderTable = (group, title) => (
    <div style={{ marginBottom: '40px' }}>
      <h3 style={{ textAlign: 'center' }}>{title}</h3>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>رقم الملف</th>
            <th>الاسم</th>
            <th>الدرجة العلمية</th>
            <th>(30%) الالتزام</th>
            <th>(30%) الجودة والإرشاد</th>
            <th>(30%) النشاط الإداري</th>
            <th>(10%) المعاملة</th>
            <th>المجموع</th>
          </tr>
        </thead>
        <tbody>
          {group.map((row, i) => {
            const total = calculateTotal(row);
            return (
              <tr key={i}>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.title}</td>
                <td><input type="number" value={row.الالتزام} onChange={(e) => handleChange(data.indexOf(row), "الالتزام", e.target.value)} style={{ width: '60px', textAlign: 'center' }} /></td>
                <td><input type="number" value={row.الجودة} onChange={(e) => handleChange(data.indexOf(row), "الجودة", e.target.value)} style={{ width: '60px', textAlign: 'center' }} /></td>
                <td><input type="number" value={row.النشاط} onChange={(e) => handleChange(data.indexOf(row), "النشاط", e.target.value)} style={{ width: '60px', textAlign: 'center' }} /></td>
                <td><input type="number" value={row.المعاملة} onChange={(e) => handleChange(data.indexOf(row), "المعاملة", e.target.value)} style={{ width: '60px', textAlign: 'center' }} /></td>
                <td>{total}</td>
              </tr>
            );
          })}
          <tr>
            <td colSpan="7" style={{ textAlign: 'center' }}><strong>المجموع الكلي</strong></td>
            <td><strong>{getGroupTotal(group)}</strong></td>
          </tr>
          <tr>
            <td colSpan="7" style={{ textAlign: 'center' }}>عدد الأفراد × 100</td>
            <td><strong>{group.length * 100}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const handleSave = async () => {
    const enrichedData = data.map(row => ({
      ...row,
      المجموع:
        Number(row.الالتزام || 0) +
        Number(row.الجودة || 0) +
        Number(row.النشاط || 0) +
        Number(row.المعاملة || 0)
    }));

    try {
      const response = await fetch("http://localhost:5000/api/submit-evaluation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          department: "science",
          evaluations: enrichedData
        })
      });

      const result = await response.json();
      if (result.success) {
        alert("✅ تم حفظ التقييمات بنجاح");
      } else {
        alert("❌ فشل في حفظ التقييمات");
      }
    } catch (error) {
      alert("⚠️ حدث خطأ أثناء الاتصال بالسيرفر");
    }
  };

  return (
    <div style={{ direction: 'rtl', padding: '20px' }}>
      <h2>تقييم - قسم العلوم الاساسية</h2>
      {renderTable(mainStaff, "اعضاء التدريس")}
      {renderTable(assistantStaff, "الهيئة المعاونة")}
      
      <button
        onClick={handleSave}
        style={{ marginTop: '30px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        💾 حفظ التقييمات
      </button>
    </div>
  );
};

export default ScienceDashboard;
