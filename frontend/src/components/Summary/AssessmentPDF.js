import React from "react";
import { Document, Page, Text, Link, View, StyleSheet } from "@react-pdf/renderer";
import { getLevel } from "../helper/getLevel";

const styles = StyleSheet.create({
  page: { padding: 70 },
  title: { fontSize: 20, textAlign: "center", fontWeight: "bold", marginBottom: 35 },
  header: { fontSize: 16, marginVertical: 15, textAlign: "center", },
  subheader: { fontSize: 14, marginVertical: 15, textAlign: "center"},
  paragraph: { fontSize: 11, marginBottom: 10, textAlign: "center" },
  pinkHeader: { fontSize: 14, color: "hotpink", textAlign: "center", marginVertical: 15 },
  skillContainer: { marginVertical: 15 },
  skillRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" },
  skillTitle: { fontSize: 12, textAlign: "left" },
  skillLevel: { fontSize: 12, textAlign: "right" },
  progressBarContainer: { width: "100%", backgroundColor: "#ddd", borderRadius: 2, height: 5, marginVertical: 5, marginBottom: 22 },
  filledProgress: { height: 5, backgroundColor: "#007bff", borderRadius: 2 },
  orangeText: { fontSize: 14, color: "orange", textAlign: "center", marginBottom: 15, marginTop: 20 },
});

const AssessmentPDF = ({ assessmentId, stats, assessment, getContentForBehaviour }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>Sky Skills Assessment Summary</Text>
      
      <Text style={styles.header}>Kickstart Your Learning Journey with Sky Skills</Text>
      <Text style={styles.paragraph}>Knowing where to start your learning journey can be tricky, which is why we have Sky Skills – the top skills to set you up</Text>

      <Text style={styles.orangeText}>Not sure where to begin?</Text>
      <Text style={styles.paragraph}>We’ve got you covered – this summary breaks down the results of your self-assessment and reveals your top 3 behavioural strenghs, pinpoints areas to grow, dives deeper into your skillset and delivers personalised learning recommendations from the Sky Skills channel on Sky Learn.
  </Text>

<Text style={styles.pinkHeader}>A Closer Look At You: Your Strength and Development Insights</Text>
      {/* Top 3 Behaviours */}
      <Text style={styles.subheader}>The Top 3 Sky Skills Behaviours Driving Your Success</Text>
      {stats.behaviourAverages.sort((a, b) => b.averageScore - a.averageScore).slice(0, 3).map((behaviour) => (
        <Text key={behaviour.behaviourName} style={styles.paragraph}>{behaviour.behaviourName}</Text>
      ))}

      {/* Bottom 3 Behaviours */}
      <Text style={styles.subheader}>The Top 3 Sky Skills Behaviours You Can Grow</Text>
      {stats.behaviourAverages.sort((a, b) => a.averageScore - b.averageScore).slice(0, 3).map((behaviour) => (
        <Text key={behaviour.behaviourName} style={styles.paragraph}>{behaviour.behaviourName}</Text>
      ))}
    </Page>

    {/* Skills Breakdown */}
    {/* Skills Breakdown - One Page Per Skill */}
    {stats.skillAverages.map((skill) => (
      <Page key={skill.skillName} style={styles.page}>
        <Text style={styles.header}>A Deeper Dive into: {skill.skillName}</Text>

        <View style={styles.skillContainer}>
          <View style={styles.skillRow}>
            <Text style={styles.skillTitle}>{skill.skillName}</Text>
            <Text style={styles.skillLevel}>{getLevel(skill.averageScore)}</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.filledProgress, { width: `${(skill.averageScore / 4) * 100}%` }]} />
          </View>

          {/* Learning Content */}
          {stats.behaviourAverages
            .filter((b) => b.skillId === skill.skillId)
            .flatMap((behaviour) => getContentForBehaviour(behaviour.behaviourId))
            .slice(0, 6)
            .map((contentItem) => {
              const relatedResponse = assessment.Responses?.find(
                (response) => response.Statement?.Content?.id === contentItem.id
              );
              const contentScore = relatedResponse?.score || 0;
              const contentLevel = getLevel(contentScore);
              const learningLink = contentItem.learningLinks?.[contentLevel];

              return (
                <View key={contentItem.id} style={{ marginBottom: 10 }}>
                  <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 10 }}>
                    {contentItem.title} - {getLevel(contentScore)}
                  </Text>
                  <Text style={{ fontSize: 10, marginBottom: 7 }}>{contentItem.description}</Text>
                  {learningLink && (
                    <Link
                      src={learningLink}
                      style={{ fontSize: 10, color: "blue", textDecoration: "none", marginBottom: 15 }}
                    >
                      Recommended Learning
                    </Link>
                  )}
                </View>
              );
            })}
        </View>
      </Page>
    ))}

  </Document>
);

export default AssessmentPDF;
