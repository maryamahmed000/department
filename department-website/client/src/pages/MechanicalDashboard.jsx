import React, { useState } from 'react';
import mechanicalData from '../data/mechanicalData';

const MechanicalDashboard = () => {
  const [data, setData] = useState(mechanicalData);

  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

  const calculateTotal = (entry) => {
    return (
      Number(entry.الالتزام || 0) +
      Number(entry.الجودة || 0) +
      Number(entry.النشاط || 0) +
      Number(entry.المعاملة || 0)
    );
  };

  const isMain = (title) =>
    title.includes("أستاذ") || (title.includes("مدرس") && !title.includes("مساعد"));

  const mainStaff = data.filter((entry) => isMain(entry.title));
  const assistantStaff = data.filter((entry) =>
    entry.title.includes("مدرس مساعد") || entry.title.includes("معيد")
  );

  const renderTable = (groupData, title) => {
    const total = groupData.reduce((sum, entry) => sum + calculateTotal(entry), 0);
    const expectedMax = groupData.length * 100;

    return (
      <>
        <h3 style={{ textAlign: 'center', marginTop: '40px' }}>{title}</h3>
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
            {groupData.map((row, i) => (
              <tr key={i}>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.title}</td>
                <td><input type="number" value={row.الالتزام} onChange={(e) => handleChange(data.indexOf(row), "الالتزام", e.target.value)} /></td>
                <td><input type="number" value={row.الجودة} onChange={(e) => handleChange(data.indexOf(row), "الجودة", e.target.value)} /></td>
                <td><input type="number" value={row.النشاط} onChange={(e) => handleChange(data.indexOf(row), "النشاط", e.target.value)} /></td>
                <td><input type="number" value={row.المعاملة} onChange={(e) => handleChange(data.indexOf(row), "المعاملة", e.target.value)} /></td>
                <td>{calculateTotal(row)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', fontWeight: 'bold' }}>المجموع الكلي</td>
              <td>{total}</td>
            </tr>
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', fontWeight: 'bold' }}>عدد الأفراد × 100</td>
              <td>{expectedMax}</td>
            </tr>
          </tbody>
        </table>
      </>
    );
  };

  const handleSave = async () => {
    const enriched = data.map(entry => ({
      ...entry,
      المجموع: calculateTotal(entry),
    }));

    try {
      const response = await fetch('/api/submit-evaluation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          department: 'mechanical',
          evaluations: enriched,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("✅ تم حفظ التقييمات بنجاح");
      } else {
        alert("❌ فشل في حفظ التقييمات");
      }
    } catch (err) {
      alert("⚠️ حدث خطأ أثناء إرسال البيانات إلى السيرفر");
    }
  };

  return (
    <div style={{ padding: '20px', direction: 'rtl' }}>
      <h2>تقييم - قسم الهندسة الميكانيكية</h2>
      {renderTable(mainStaff, "الأساتذة والمدرسون")}
      {renderTable(assistantStaff, "الهيئة المعاونة")}

      <button
        onClick={handleSave}
        style={{
          marginTop: '30px',
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px'
        }}
      >
        💾 حفظ التقييمات
      </button>
    </div>
  );
};

export default MechanicalDashboard;
