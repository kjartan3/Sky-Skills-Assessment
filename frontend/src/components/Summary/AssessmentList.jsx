import React from 'react';
import { jsPDF } from 'jspdf';

const getLevel = (score) => {
  if (score >= 3.75) return "Advanced";
  if (score >= 2.5) return "Intermediate";
  return "Beginner";
};

// Helper to check if we need to add a new page.
const checkAddPage = (doc, y) => {
  if (y > 270) {
    doc.addPage();
    return 20;
  }
  return y;
};



const generatePDF = (assessmentId, stats, assessment, getContentForBehaviour) => {
  let y = 20;
  const lineHeight = 7;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();


  doc.setFont("helvetica");
  doc.setFontSize(18);

  doc.text("Sky Skills Assessment Summary", pageWidth / 2, y / 2 + 6, { align: "center" });
  y += 10;
  y = checkAddPage(doc, y);

  // ─── preIntroHeader with Gradient ───────────────────
  const preIntroHeader = "Kickstart Your Learning Journey with Sky Skills";
  const headerHeight = 10;
  
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(preIntroHeader, pageWidth / 2, y + headerHeight / 2 + 4, { align: "center" });
  y += headerHeight + 10;
  y = checkAddPage(doc, y);

  // ─── Pre Intro Paragraph (left aligned) ─────────────
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const preIntro = "Knowing where to start your learning journey can be tricky, which is why we have Sky Skills – the top skills to set you up for success here at Sly.";
  const preIntroLines = doc.splitTextToSize(preIntro, pageWidth - 40);
  preIntroLines.forEach(line => {
    doc.text(line, 20, y);
    y += lineHeight;
    y = checkAddPage(doc, y);
  });
  y += 10;

  // ─── introHeader in ORANGE (centered) ───────────────
  const introHeader = "Not sure where to begin?";
  doc.setFontSize(14);
  doc.setTextColor(255, 165, 0); // Orange
  doc.text(introHeader, pageWidth / 2, y, { align: "center" });
  y += 10;
  y = checkAddPage(doc, y);

  // ─── Intro Paragraph (left aligned) ───────────────
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const intro = "We’ve got you covered – this summary breaks down the results of your self-assessment and reveals your top 3 behavioural strengths, pinpoints areas to grow, dives deeper into your skillset and delivers personalised learning recommendations from the Sky Skills channel on Sky Learn.";
  const introLines = doc.splitTextToSize(intro, pageWidth - 40);
  introLines.forEach(line => {
    doc.text(line, 20, y);
    y += lineHeight;
    y = checkAddPage(doc, y);
  });
  y += 10;

  // ─── preSortedBehavioursHeader in PINK (centered) ─────────────
  const preSortedBehavioursHeader = "A closer Look at You: Your Strength and Development Insights";
  doc.setFontSize(14);
  doc.setTextColor(255, 105, 180); // Pink
  doc.text(preSortedBehavioursHeader, pageWidth / 2, y, { align: "center" });
  y += 10;
  y = checkAddPage(doc, y);

  // ─── Sorted Behaviours Section ───────────────────
  // Sort behaviours by highest score first.
  const sortedBehaviours = [...stats.behaviourAverages].sort((a, b) => b.averageScore - a.averageScore);
  const highestBehaviours = sortedBehaviours.slice(0, 3);
  const lowestBehaviours = sortedBehaviours.slice(-3);

  // Top 3 behaviours header (centered)
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("The Top 3 Sky Skills Behaviours driving your success", pageWidth / 2, y, { align: "center" });
  y += 10;
  // Display top behaviours with green tick icons.
  highestBehaviours.forEach((behaviour) => {
    const lineText = `${behaviour.behaviourName}`;
    doc.text(lineText, pageWidth / 2, y, { align: "center" });
    y += 8;
    y = checkAddPage(doc, y);
  });
  y += 10;

  // Bottom 3 behaviours header (centered)
  doc.text("The Top 3 Sky Skills Behaviours you can grow", pageWidth / 2, y, { align: "center" });
  y += 10;
  // Display bottom behaviours with target icons.
  lowestBehaviours.forEach((behaviour) => {
    const lineText = `${behaviour.behaviourName}`;
    doc.text(lineText, pageWidth / 2, y, { align: "center" });
    y += 8;
    y = checkAddPage(doc, y);
  });
  y += 10;


  doc.setFontSize(14)
  doc.text("A Deeper Dive", pageWidth / 2, y , { align: "center" });
  y += 10;
  y = checkAddPage(doc, y);

  // ─── Skills Breakdown Section ───────────────────
  stats.skillAverages.forEach((skill) => {
    doc.setFontSize(12);
    // Center the skill name.
    doc.text(`${skill.skillName}`, pageWidth / 2, y, { align: "center" });
    y += 5;
    y = checkAddPage(doc, y);

    // Draw a centered progress bar.
    const barWidth = pageWidth * 0.8;
    const barHeight = 3;
    const barX = (pageWidth - barWidth) / 2;
    const barY = y;
    doc.setFillColor(211, 211, 211);
    doc.roundedRect(barX, barY, barWidth, barHeight, 2, 2, 'FD');
    const fillWidth = barWidth * (skill.averageScore / 4);
    doc.setFillColor(0, 123, 255);
    doc.roundedRect(barX, barY, fillWidth, barHeight, 2, 2, 'F');

    // Position the level text above the right side of the progress bar.
    const levelText = `${getLevel(skill.averageScore)}`;
    doc.setFontSize(10);
    const levelTextWidth = doc.getTextWidth(levelText);
    const levelTextX = barX + barWidth - levelTextWidth - 5;
    doc.text(levelText, levelTextX, barY + barHeight + 6);
    y += barHeight + 10;
    y = checkAddPage(doc, y);

    //   const behaviours = stats.behaviourAverages.filter(b => b.skillId === skill.skillId);More actions
  //   behaviours.forEach((behaviour) => {
  //     const behaviourLevel = getLevel(behaviour.averageScore);
  //     doc.text(`- ${behaviour.behaviourName}: ${behaviourLevel} (${behaviour.averageScore.toFixed(2)})`, 25, y);
  //     y += lineHeight;
  //     checkAddPage();

  //     const contentItems = getContentForBehaviour(behaviour.behaviourId);
  //     if (contentItems.length > 0) {
  //       contentItems.forEach((contentItem) => {
  //         const titleLines = doc.splitTextToSize(`• ${contentItem.title}`, 160);
  //         const descLines = doc.splitTextToSize(contentItem.description, 160);
  //         const link = contentItem.learningLinks?.[behaviourLevel];
  //         const linkText = link
  //           ? `Learning Link (${behaviourLevel}): ${link}`
  //           : `No learning link available for ${behaviourLevel}`;
  //         const linkLines = doc.splitTextToSize(linkText, 160);

  //         [...titleLines, ...descLines, ...linkLines].forEach(line => {
  //           doc.text(line, 30, y);
  //           y += lineHeight;
  //           checkAddPage();
  //         });

  //         y += 3;
  //       });
  //     } else {
  //       doc.text("  No content available for this behaviour.", 30, y);
  //       y += lineHeight;
  //       checkAddPage();
  //     }
  //   });

  });

  doc.save(`assessment_${assessmentId}.pdf`);
};

const AssessmentList = ({
  assessments,
  hoveredId,
  setHoveredId,
  setSelectedAssessmentId,
  COLORS,
  stats,
  getContentForBehaviour, // Passed from parent
}) => {
  return (
    <div className="side-list">
      {assessments.map((a, index) => (
        <div
          key={a.id}
          className="assessment-list-item"
          onClick={() => setSelectedAssessmentId(a.id)}
          onMouseEnter={() => setHoveredId(a.id)}
          onMouseLeave={() => setHoveredId(null)}
          style={{
            color: COLORS[index % COLORS.length],
            fontWeight: hoveredId === a.id ? 'bold' : 'normal',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          <div>
            <strong>Assessment</strong>
            <br />
            <small>{new Date(a.createdAt).toLocaleDateString()}</small>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Pass the entire assessment object and getContentForBehaviour to generatePDF.
              generatePDF(a.id, stats[a.id], a, getContentForBehaviour);
            }}
            style={{
              marginTop: '5px',
              padding: '5px 10px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Download as PDF
          </button>
        </div>
      ))}
    </div>
  );
};

export default AssessmentList;
