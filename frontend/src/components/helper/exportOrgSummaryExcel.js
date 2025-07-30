import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


export const downloadOrgSummaryExcel = ({
  skills = [],
  topBehaviours = [],
  bottomBehaviours = [],
  topContent = [],
  bottomContent = [],
  selectedOrgUnit = 'All',
  selectedBand = 'All'
}) => {
  try {
    const workbook = XLSX.utils.book_new();

    // Metadata sheet
    const metadataSheet = XLSX.utils.aoa_to_sheet([
      ['Organisational Summary'],
      ['Org Unit', selectedOrgUnit],
      ['Band', selectedBand],
      ['Date', new Date().toLocaleDateString()],
    ]);
    XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Metadata');

    // Values (ranked 1–4)
    const valuesSheet = XLSX.utils.json_to_sheet(
      skills.map((s, i) => ({
        Rank: i + 1,
        Value: s.name,
        Score: s.averageScore?.toFixed(2) ?? 'N/A',
      }))
    );
    XLSX.utils.book_append_sheet(workbook, valuesSheet, 'Values');

    // Top Behaviours
    const topBehavioursSheet = XLSX.utils.json_to_sheet(
      topBehaviours.map((b, i) => ({
        Rank: i + 1,
        Behaviour: b.name,
        Score: b.averageScore?.toFixed(2) ?? 'N/A',
      }))
    );
    XLSX.utils.book_append_sheet(workbook, topBehavioursSheet, 'Top Behaviours');

    // Bottom Behaviours
    const bottomBehavioursSheet = XLSX.utils.json_to_sheet(
      bottomBehaviours.map((b, i) => ({
        Rank: i + 1,
        Behaviour: b.name,
        Score: b.averageScore?.toFixed(2) ?? 'N/A',
      }))
    );
    XLSX.utils.book_append_sheet(workbook, bottomBehavioursSheet, 'Bottom Behaviours');

    // Top Skills
    const topSkillsSheet = XLSX.utils.json_to_sheet(
      topContent.map((c, i) => ({
        Rank: i + 1,
        Skill: c.name,
        Score: c.averageScore?.toFixed(2) ?? 'N/A',
      }))
    );
    XLSX.utils.book_append_sheet(workbook, topSkillsSheet, 'Top Skills');

    // Bottom Skills
    const bottomSkillsSheet = XLSX.utils.json_to_sheet(
      bottomContent.map((c, i) => ({
        Rank: i + 1,
        Skill: c.name,
        Score: c.averageScore?.toFixed(2) ?? 'N/A',
      }))
    );
    XLSX.utils.book_append_sheet(workbook, bottomSkillsSheet, 'Bottom Skills');

    // Save file
    const filename = `OrgSummary_${selectedOrgUnit}_${selectedBand}_${new Date().toISOString().split('T')[0]}.xlsx`;
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, filename);
  } catch (err) {
    console.error('❌ Error exporting org summary:', err.message);
  }
};
