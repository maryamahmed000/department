import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const departments = {
  civil: 'الهندسة المدنية',
  electrical: 'الهندسة الكهربية',
  mechanical: 'الهندسة الميكانيكية',
  architecture: 'هندسة عمارة',
  science: 'العلوم الأساسية',
};

const HRDashboard = () => {
  const [evaluations, setEvaluations] = useState({});

  useEffect(() => {
    Object.keys(departments).forEach(async (dep) => {
      const res = await fetch(`/api/evaluations/${dep}`);
      const data = await res.json();

      const professors = data['الأساتذة والمدرسون'] || [];
      const assistants = data['الهيئة المعاونة'] || [];

      setEvaluations((prev) => ({
        ...prev,
        [dep]: { professors, assistants }
      }));
    });
  }, []);

  const calculateTotal = (group) => {
    return group.reduce((sum, row) =>
      sum + (Number(row.الالتزام || 0) + Number(row.الجودة || 0) + Number(row.النشاط || 0) + Number(row.المعاملة || 0))
    , 0);
  };

  const downloadExcel = (key) => {
    const { professors = [], assistants = [] } = evaluations[key] || {};

    if (professors.length === 0 && assistants.length === 0) {
      return alert('لا توجد بيانات للتنزيل');
    }

    const workbook = XLSX.utils.book_new();

    const appendSummary = (group) => {
      return [
        {},
        { name: 'المجموع الكلي', المجموع: calculateTotal(group) },
        { name: 'الحد الأقصى المتوقع', المجموع: group.length * 100 }
      ];
    };

    if (professors.length > 0) {
      const profSheetData = [...professors, ...appendSummary(professors)];
      const profSheet = XLSX.utils.json_to_sheet(profSheetData);
      XLSX.utils.book_append_sheet(workbook, profSheet, 'الأساتذة');
    }

    if (assistants.length > 0) {
      const assistSheetData = [...assistants, ...appendSummary(assistants)];
      const assistSheet = XLSX.utils.json_to_sheet(assistSheetData);
      XLSX.utils.book_append_sheet(workbook, assistSheet, 'الهيئة المعاونة');
    }

    XLSX.writeFile(workbook, `تقييمات_${key}.xlsx`);
  };

  return (
    <div style={{ direction: 'rtl', padding: '20px' }}>
      <h2>لوحة تحكم الموارد البشرية</h2>
      {Object.keys(departments).map((key) => {
        const { professors = [], assistants = [] } = evaluations[key] || {};

        return (
          <div key={key} style={{ marginBottom: '40px' }}>
            <h3>{departments[key]}</h3>

            <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '10px' }}>
              <thead>
                <tr>
                  <th>الرقم</th>
                  <th>الاسم</th>
                  <th>الدرجة</th>
                  <th>الالتزام</th>
                  <th>الجودة</th>
                  <th>النشاط</th>
                  <th>المعاملة</th>
                  <th>المجموع</th>
                </tr>
              </thead>
              <tbody>
                {professors.map((row, i) => {
                  const total =
                    Number(row.الالتزام || 0) +
                    Number(row.الجودة || 0) +
                    Number(row.النشاط || 0) +
                    Number(row.المعاملة || 0);
                  return (
                    <tr key={i}>
                      <td>{row.id}</td>
                      <td>{row.name}</td>
                      <td>{row.title}</td>
                      <td>{row.الالتزام}</td>
                      <td>{row.الجودة}</td>
                      <td>{row.النشاط}</td>
                      <td>{row.المعاملة}</td>
                      <td>{total}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>المجموع الكلي</td>
                  <td>{calculateTotal(professors)}</td>
                </tr>
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>الحد الأقصى المتوقع</td>
                  <td>{professors.length * 100}</td>
                </tr>
              </tbody>
            </table>

            <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th>الرقم</th>
                  <th>الاسم</th>
                  <th>الدرجة</th>
                  <th>الالتزام</th>
                  <th>الجودة</th>
                  <th>النشاط</th>
                  <th>المعاملة</th>
                  <th>المجموع</th>
                </tr>
              </thead>
              <tbody>
                {assistants.map((row, i) => {
                  const total =
                    Number(row.الالتزام || 0) +
                    Number(row.الجودة || 0) +
                    Number(row.النشاط || 0) +
                    Number(row.المعاملة || 0);
                  return (
                    <tr key={i}>
                      <td>{row.id}</td>
                      <td>{row.name}</td>
                      <td>{row.title}</td>
                      <td>{row.الالتزام}</td>
                      <td>{row.الجودة}</td>
                      <td>{row.النشاط}</td>
                      <td>{row.المعاملة}</td>
                      <td>{total}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>المجموع الكلي</td>
                  <td>{calculateTotal(assistants)}</td>
                </tr>
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>الحد الأقصى المتوقع</td>
                  <td>{assistants.length * 100}</td>
                </tr>
              </tbody>
            </table>

            <button
              onClick={() => downloadExcel(key)}
              style={{ marginTop: '10px', backgroundColor: '#4CAF50', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '5px' }}
            >
              📥 تنزيل التقرير الكامل
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default HRDashboard;

