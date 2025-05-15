import React, { useState } from 'react';
import electricalData from '../data/electricalData';

const ElectricalDashboard = () => {
  const [data, setData] = useState(electricalData);

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

  const professorsAndLecturers = data.filter(item =>
    (item.title.includes('أستاذ') || item.title.includes('مدرس')) &&
    item.name !== "م.م/ سوزان محمد شريف محمود الجارحى" &&
    item.name !== "م.م/ رامز حسنى جاد الرب شحاته"
  );

  const assistantsAndResearchers = data.filter(item =>
    (item.title.includes('مساعد') || item.title.includes('معيد')) &&
    item.name !== "أ.م.د/ سوزان محمد على شكرى"
  );

  const getGroupTotal = (group) =>
    group.reduce((sum, item) => sum + calculateTotal(item), 0);

  const handleSubmit = async () => {
    const enriched = data.map(entry => ({
      ...entry,
      الالتزام: Number(entry.الالتزام || 0),
      الجودة: Number(entry.الجودة || 0),
      النشاط: Number(entry.النشاط || 0),
      المعاملة: Number(entry.المعاملة || 0),
      المجموع:
        Number(entry.الالتزام || 0) +
        Number(entry.الجودة || 0) +
        Number(entry.النشاط || 0) +
        Number(entry.المعاملة || 0)
    }));
  
    try {
      const response = await fetch('/api/submit-evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department: 'electrical',
          evaluations: enriched
        }),
      });
  
      const result = await response.json();
      if (result.success) {
        alert('✅ تم حفظ التقييمات بنجاح');
      } else {
        alert('❌ فشل في حفظ التقييمات');
      }
    } catch (err) {
      alert('⚠️ حدث خطأ أثناء إرسال البيانات إلى السيرفر');
    }
  };
  

      
 

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

  return (
    <div style={{ direction: 'rtl', padding: '20px' }}>
      <h2>تقييم - قسم الهندسة الكهربية</h2>
      {renderTable(professorsAndLecturers, "اعضاء هيئة التدريس")}
      {renderTable(assistantsAndResearchers, "الهيئة المعاونة")}

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button onClick={handleSubmit} style={{ padding: '10px 30px', fontSize: '16px' }}>
          💾 حفظ التقييمات
        </button>
      </div>
    </div>
  );
};

export default ElectricalDashboard;
