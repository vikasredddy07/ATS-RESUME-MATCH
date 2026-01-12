
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType, HeightRule } from "docx";
import { ResumeData, ResumeTemplate } from "../types";

export async function exportToDocx(data: ResumeData, template: ResumeTemplate = 'standard') {
  const isTwoColumn = template === 'two-column';
  const isModern = template === 'modern';

  const children: any[] = [];

  if (isTwoColumn) {
    // Two-Column Layout (Professional Sample)
    // Header: Top Left Name/Title, Top Right Contact
    const headerTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 60, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: data.personalInfo.fullName, bold: true, size: 48 })],
                }),
                new Paragraph({
                  children: [new TextRun({ text: data.experience[0]?.role || "Professional", bold: true, size: 28 })],
                  spacing: { after: 100 },
                }),
                new Paragraph({
                  children: [new TextRun({ text: data.summary, size: 18 })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 40, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: data.personalInfo.location })],
                }),
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: data.personalInfo.phone })],
                }),
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: data.personalInfo.email, color: "0000EE" })],
                }),
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: data.personalInfo.linkedin || "" })],
                }),
              ],
            }),
          ],
        }),
      ],
    });

    children.push(headerTable, new Paragraph({ text: "", spacing: { after: 400 } }));

    // Main Content Table
    const mainTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            // Left Column: Experience
            new TableCell({
              width: { size: 65, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: "EXPERIENCE", bold: true, color: "2563eb", size: 20 })],
                  spacing: { after: 200 },
                }),
                ...data.experience.flatMap((exp) => [
                  new Paragraph({
                    children: [new TextRun({ text: exp.company, bold: true, size: 24 }), new TextRun({ text: `, ${data.personalInfo.location}`, size: 24 })],
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: exp.role, bold: true, italics: true, size: 20 })],
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: `${exp.startDate} - ${exp.endDate}`, size: 18 })],
                    spacing: { after: 100 },
                  }),
                  ...exp.description.map(bullet => new Paragraph({
                    text: bullet,
                    bullet: { level: 0 },
                    spacing: { after: 100 },
                  })),
                  new Paragraph({ text: "", spacing: { after: 200 } }),
                ]),
              ],
            }),
            // Right Column: Skills, Education
            new TableCell({
              width: { size: 35, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: "SKILLS", bold: true, color: "2563eb", size: 20 })],
                  spacing: { after: 200 },
                }),
                ...data.skills.map(skill => new Paragraph({ text: skill, spacing: { after: 50 } })),
                new Paragraph({ text: "", spacing: { after: 400 } }),
                new Paragraph({
                  children: [new TextRun({ text: "EDUCATION", bold: true, color: "2563eb", size: 20 })],
                  spacing: { after: 200 },
                }),
                ...data.education.flatMap(edu => [
                  new Paragraph({
                    children: [new TextRun({ text: edu.school, bold: true, size: 22 })],
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: edu.degree, size: 18 })],
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: edu.graduationDate, bold: true, size: 18 })],
                    spacing: { after: 100 },
                  }),
                  new Paragraph({ text: edu.location, size: 16, spacing: { after: 200 } }),
                ]),
              ],
            }),
          ],
        }),
      ],
    });
    children.push(mainTable);

  } else {
    // Other Templates (Standard, Modern, Minimalist)
    if (template === 'standard') {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: data.personalInfo.fullName.toUpperCase(), bold: true, size: 32 })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun(`${data.personalInfo.location} | ${data.personalInfo.phone} | ${data.personalInfo.email}`)],
        })
      );
    } else {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: data.personalInfo.fullName, bold: true, size: 40, color: isModern ? "1d4ed8" : "000000" })],
        }),
        new Paragraph({
          children: [new TextRun(`${data.personalInfo.email} • ${data.personalInfo.phone} • ${data.personalInfo.location}`)],
          spacing: { after: 200 },
        })
      );
    }

    const createSectionHeader = (title: string) => new Paragraph({
      text: title.toUpperCase(),
      heading: HeadingLevel.HEADING_1,
      border: template === 'standard' ? { bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 } } : undefined,
      spacing: { before: 200, after: 100 },
      shading: isModern ? { fill: "f1f5f9", type: "clear", color: "auto" } : undefined,
    });

    children.push(createSectionHeader("Summary"), new Paragraph({ children: [new TextRun(data.summary)], spacing: { after: 200 } }));
    children.push(createSectionHeader("Experience"));
    data.experience.forEach(exp => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: exp.company, bold: true }), new TextRun({ text: `\t${exp.startDate} – ${exp.endDate}`, bold: true })],
          tabStops: [{ type: AlignmentType.RIGHT, position: 9000 }],
        }),
        new Paragraph({ children: [new TextRun({ text: exp.role, italics: true })], spacing: { after: 100 } }),
        ...exp.description.map(b => new Paragraph({ text: b, bullet: { level: 0 }, spacing: { after: 50 } }))
      );
    });
    children.push(createSectionHeader("Education"));
    data.education.forEach(edu => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: edu.school, bold: true }), new TextRun({ text: `\t${edu.graduationDate}`, bold: true })],
          tabStops: [{ type: AlignmentType.RIGHT, position: 9000 }],
        }),
        new Paragraph({ text: `${edu.degree} | ${edu.location}` })
      );
    });
    children.push(createSectionHeader("Skills"), new Paragraph({ children: [new TextRun(data.skills.join(", "))] }));
  }

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${data.personalInfo.fullName.replace(/\s+/g, "_")}_Resume_${template}.docx`;
  a.click();
}
