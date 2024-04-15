import { ProjectEntity } from '../../../domain';
import ExcelJS from 'exceljs';


export const projectFollowingXlsx = async (projectEntity: ProjectEntity): Promise<string> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Formulario');
  worksheet.mergeCells('A1:B1');
  worksheet.mergeCells('A2:B2');
  worksheet.mergeCells('A3:B3');
  // worksheet.mergeCells('A1:A3');
  worksheet.mergeCells('G1:H1');
  worksheet.getCell('G1').value = 'UNIFRANZ';
  worksheet.mergeCells('G2:H2');
  worksheet.getCell('G2').value = 'FACULTAD DE INGENIERÍA';
  worksheet.mergeCells('G3:H3');
  worksheet.getCell('G3').value = 'INGENIERÍA DE SISTEMAS';
  worksheet.mergeCells('A4:H4');
  worksheet.getCell('A4').value = 'CONTROL Y SEGUIMIENTO DE PROYECTOS';
  worksheet.getCell('A4').alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };
  worksheet.getCell('A4').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'DF8244' },
  };
  worksheet.getCell('A4').font = { bold: true };

  worksheet.mergeCells('A5:D5');
  worksheet.getCell('A5').value = 'INFORMACIÓN PERSONAL DE LOS ESTUDIANTES';
  worksheet.getCell('A5').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'DF8244' },
  };
  worksheet.getCell('A5').alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };
  worksheet.getCell('A5').font = { bold: true };

  worksheet.mergeCells('E5:H5');
  worksheet.getCell('E5').value = 'INFORMACIÓN DE MATERIAS';
  worksheet.getCell('E5').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'DF8244' },
  };
  worksheet.getCell('E5').alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };
  worksheet.getCell('E5').font = { bold: true };
  const titleRow = worksheet.getRow(6);

  titleRow.getCell(1).value = 'APELLIDO(S):';
  titleRow.getCell(2).value = 'NOMBRE(S):';
  worksheet.mergeCells('C6:D6');
  titleRow.getCell(3).value = 'CODIGO(S):';
  worksheet.mergeCells('E6:F6');
  titleRow.getCell(5).value = 'MATERIA(S):';
  worksheet.mergeCells('G6:H6');
  titleRow.getCell(7).value = 'SEMESTRE:';
  const studentData = projectEntity.students.map((student) => [
    student.lastName,
    student.name,
    student.code,
  ]);
  const materiaData = projectEntity.parallels.map((parallel) => [
    parallel.subject?.code,
    parallel.subject?.semester,
  ]);
  const mergedArray = [];

  for (let i = 0; i < Math.max(studentData.length, materiaData.length); i++) {
    const student = studentData[i] || [, , ,]; // Obtener el estudiante correspondiente si existe
    const subject = materiaData[i] || [, , , '']; // Obtener la asignatura correspondiente si existe
    mergedArray.push([...student, ...subject]); // Combinar los datos del estudiante y la asignatura
  }
  let maxLastNameLength = 0;
  let maxFirstNameLength = 0;

  // mergedArray.forEach((data, index) => {
  //   const rowNumber = 7 + index;
  //   worksheet.mergeCells(`C${rowNumber}:D${rowNumber}`);
  //   worksheet.mergeCells(`E${rowNumber}:F${rowNumber}`);
  //   worksheet.mergeCells(`G${rowNumber}:H${rowNumber}`);
  //   const lastName = data[0] || ''; // Apellidos
  //   const firstName = data[1] || ''; // Nombres

  //   worksheet.getCell(`A${rowNumber}`).value = lastName;
  //   worksheet.getCell(`B${rowNumber}`).value = firstName;

  //   if (lastName.length > maxLastNameLength) {
  //     maxLastNameLength = lastName.length;
  //   }

  //   if (firstName.length > maxFirstNameLength) {
  //     maxFirstNameLength = firstName.length;
  //   }

  //   worksheet.getCell(`C${rowNumber}`).value = data[2]; // Códigos
  //   worksheet.getCell(`E${rowNumber}`).value = data[3]; // Nombres
  //   worksheet.getCell(`G${rowNumber}`).value = data[4]; // Códigos
  // });

  worksheet.getColumn('A').width = maxLastNameLength + 2;
  worksheet.getColumn('B').width = maxFirstNameLength + 2;
  let startRow = worksheet.rowCount + 1;
  worksheet.addRow(['DATOS DEL PROYECTO']);
  worksheet.mergeCells(`A${startRow}:H${startRow}`);
  const mergedCell = worksheet.getCell(`A${startRow}`);
  mergedCell.value = 'DATOS DEL PROYECTO';
  mergedCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'DF8244' },
  };
  mergedCell.font = { bold: true };
  //titulo del proyecto
  startRow = worksheet.rowCount + 1;
  worksheet.addRow(['TITULO DEL PROYECTO:']);
  worksheet.mergeCells(`A${startRow}:H${startRow}`);
  worksheet.getCell(`A${startRow}`).alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };
  worksheet.getCell(`A${startRow}`).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFEAB28B' },
  };
  worksheet.getCell(`A${startRow}`).font = { bold: true };
  //espacio para el titulo
  const totalWidth =
    worksheet.getColumn(1).width! + worksheet.getColumn(2).width! + 48;
  startRow = worksheet.rowCount + 1;
  worksheet.addRow([projectEntity.title]);
  worksheet.mergeCells(`A${startRow}:H${startRow}`);
  worksheet.getCell(`A${startRow}`).alignment = { wrapText: true };
  worksheet.getRow(startRow).height =
    Math.ceil(projectEntity.title!.length / totalWidth) * 15;
  //objetivo general
  startRow = worksheet.rowCount + 1;
  worksheet.addRow(['OBJETIVO GENERAL:']);
  worksheet.mergeCells(`A${startRow}:H${startRow}`);
  worksheet.getCell(`A${startRow}`).alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };
  worksheet.getCell(`A${startRow}`).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFEAB28B' },
  };
  //espacio para el objetivo general
  // startRow = worksheet.rowCount + 1;
  // worksheet.addRow([proyecto[0].project.generalObjective]);
  // worksheet.mergeCells(`A${startRow}:H${startRow}`);
  // worksheet.getCell(`A${startRow}`).alignment = { wrapText: true };
  // worksheet.getRow(startRow).height =
  //   Math.ceil(proyecto[0].project.generalObjective.length / totalWidth) * 15;
  //problematica de la investigación
  startRow = worksheet.rowCount + 1;
  worksheet.addRow(['PROBLEMA DE LA INVESTIGACIÓN:']);
  worksheet.mergeCells(`A${startRow}:H${startRow}`);
  worksheet.getCell(`A${startRow}`).alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };
  worksheet.getCell(`A${startRow}`).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFEAB28B' },
  };
  //espacio para el problema de la investigacio4n
  // startRow = worksheet.rowCount + 1;
  // worksheet.addRow([proyecto[0].project.researchProblem]);
  // worksheet.mergeCells(`A${startRow}:H${startRow}`);
  // worksheet.getCell(`A${startRow}`).alignment = { wrapText: true };
  // worksheet.getRow(startRow).height =
  //   Math.ceil(proyecto[0].project.researchProblem.length / totalWidth) * 15;
  //seguimiento del proyecto
  startRow = worksheet.rowCount + 1;
  worksheet.addRow(['SEGUIMIENTO Y OBSERVACIONES DEL PROYECTO']);
  worksheet.mergeCells(`A${startRow}:H${startRow}`);
  worksheet.getCell(`A${startRow}`).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'DF8244' },
  };
  worksheet.getCell(`A${startRow}`).font = { bold: true };
  projectEntity.season.stages!.forEach((stage) => {
    startRow = worksheet.rowCount + 1;
    worksheet.mergeCells(`A${startRow}:C${startRow}`);
    worksheet.getCell(`A${startRow}`).value = 'NOMBRE Y FIRMA DEL DOCENTE';
    worksheet.getCell(`A${startRow}:C${startRow}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    worksheet.getCell(`A${startRow}:C${startRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFBE6A3' },
    };
    worksheet.mergeCells(`D${startRow}:H${startRow}`);
    worksheet.getCell(`D${startRow}`).value =
      'NIVEL DE DESARROLLO DEL PROYECTO';
    worksheet.getCell(`D${startRow}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    worksheet.getCell(`D${startRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFBE6A3' },
    };
    startRow = worksheet.rowCount + 1;
    worksheet.mergeCells(`A${startRow}:C${startRow}`);
    worksheet.getCell(`A${startRow}`).value = stage.name;
    worksheet.getCell(`A${startRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEAB28B' },
    };
    //
    worksheet.getCell(`D${startRow}`).value = '20%';
    worksheet.getCell(`D${startRow}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    worksheet.getCell(`D${startRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEAB28B' },
    };

    worksheet.getCell(`E${startRow}`).value = '40%';
    worksheet.getCell(`E${startRow}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    worksheet.getCell(`E${startRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEAB28B' },
    };

    worksheet.getCell(`F${startRow}`).value = '60%';
    worksheet.getCell(`F${startRow}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    worksheet.getCell(`F${startRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEAB28B' },
    };

    worksheet.getCell(`G${startRow}`).value = '80%';
    worksheet.getCell(`G${startRow}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    worksheet.getCell(`G${startRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEAB28B' },
    };

    worksheet.getCell(`H${startRow}`).value = '100%';
    worksheet.getCell(`H${startRow}`).alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    worksheet.getCell(`H${startRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEAB28B' },
    };
    projectEntity.parallels.forEach((parallel) => {
      startRow = worksheet.rowCount + 1;
      worksheet.mergeCells(`A${startRow}:C${startRow}`);
      worksheet.getCell(
        `A${startRow}`
      ).value = `DOCENTE: ${parallel.teacher!.name} ${parallel.teacher!.lastName}`;
      //combo box
      worksheet.getCell(`D${startRow}`).value = '\u2610';
      worksheet.getCell(`D${startRow}`).font = {
        name: 'Wingdings',
        size: 12,
        bold: true,
      };
      worksheet.getCell(`D${startRow}`).alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
      //combo box
      worksheet.getCell(`E${startRow}`).value = '\u2610';
      worksheet.getCell(`E${startRow}`).font = {
        name: 'Wingdings',
        size: 12,
        bold: true,
      };
      worksheet.getCell(`E${startRow}`).alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
      //combo box
      worksheet.getCell(`F${startRow}`).value = '\u2610';
      worksheet.getCell(`F${startRow}`).font = {
        name: 'Wingdings',
        size: 12,
        bold: true,
      };
      worksheet.getCell(`F${startRow}`).alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
      //combo box
      worksheet.getCell(`G${startRow}`).value = '\u2610';
      worksheet.getCell(`G${startRow}`).font = {
        name: 'Wingdings',
        size: 12,
        bold: true,
      };
      worksheet.getCell(`G${startRow}`).alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
      //combo box
      worksheet.getCell(`H${startRow}`).value = '\u2610';
      worksheet.getCell(`H${startRow}`).font = {
        name: 'Wingdings',
        size: 12,
        bold: true,
      };
      worksheet.getCell(`H${startRow}`).alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
      startRow = worksheet.rowCount + 1;
      worksheet.mergeCells(`A${startRow}:C${startRow}`);
      worksheet.getCell(
        `A${startRow}`
      ).value = `MATERIA: ${parallel.subject!.name}`;
      worksheet.mergeCells(`D${startRow}:H${startRow}`);
      worksheet.getCell(`D${startRow}`).value = `FIRMA Y/O SELLO:`;
    });
  });
  startRow = worksheet.rowCount + 1;
  worksheet.mergeCells(`A${startRow}:D${startRow}`);
  worksheet.getCell(`A${startRow}`).value = `ESTUDIANTE COMUNIDAD`;
  worksheet.mergeCells(`E${startRow}:F${startRow}`);
  worksheet.getCell(`E${startRow}`).value = `SELLO COMUNIDAD`;
  worksheet.mergeCells(`G${startRow}:H${startRow}`);
  worksheet.getCell(`G${startRow}`).value = `SELLO DIREC. CARRERA`;
  startRow = worksheet.rowCount + 1;
  worksheet.mergeCells(`A${startRow}:D${startRow}`);
  worksheet.mergeCells(`E${startRow}:F${startRow}`);
  worksheet.mergeCells(`G${startRow}:H${startRow}`);
  // const user = await UserSchema.findById(proyecto[0].project.responsible);
  worksheet.getCell(`A${startRow}`).value = `${projectEntity.staff.name} ${projectEntity.staff.lastName}`;
  // Generar el archivo Excel en memoria

  try {
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer.toString();
  } catch (error) {
    console.log('Error al generar el archivo Excel: ' + error);
    throw new Error('Error al generar el archivo Excel');
  }
};