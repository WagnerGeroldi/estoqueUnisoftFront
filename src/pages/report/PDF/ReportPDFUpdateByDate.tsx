import pdfMake from "pdfmake/build/pdfmake";
import pdfVfsRaw from "../../../assets/pdf-vfs.json";
import {base64Image} from "../image"

const pdfVfs: any = pdfVfsRaw;


import { HandleOnlyDate } from "../../../services/HandleOnlyDate";

export function ReportPDFUpdateByDate(products: any, initialDate: string, finalDate: string) {
  
pdfMake.vfs = pdfVfs.pdfMake.vfs;

  pdfMake.fonts = {
    Roboto: {
      normal: "Roboto-Regular.ttf",
      bold: "Roboto-Medium.ttf",
      italics: "Roboto-Italic.ttf",
      bolditalics: "Roboto-MediumItalic.ttf",
    },
  };

  function reverseDate(date: any) {
    var splitDate = date.split("");    
    var reverseArray = [splitDate[8], splitDate[9],splitDate[7],splitDate[5],splitDate[6],splitDate[4],splitDate[0],splitDate[1],splitDate[2],splitDate[3]];
    var joinDate = reverseArray.join("");
    return joinDate;
  }

  

  const pdfTitle = [
    {
      image: base64Image,
      alignment: "center",
      width: 500,
      margin: [10, 10, 10, 10],
    },
  ];

  const data = products.map((item: any) => {

    const date = HandleOnlyDate(new Date(item.updatedAt))
   
    return [
      { text: item.product, fontSize: 9, alignment: "center" },
      { text: item.quantity, fontSize: 9, alignment: "center" },
      { text: date.props.children, fontSize: 9, alignment: "center" },
    ];
  });

  const dataInfo = [
    {
      table: {
        headerRows: 1,
        widths: ["*", "*", "*"],
        alignment: "center",

        body: [
          [
            { text: "Nome", style: "tableHeader", alignment: "center" },
            { text: "Quantidade", style: "tableHeader", alignment: "center" },
            { text: "Data da Entrada", style: "tableHeader", alignment: "center" },
          ],
          ...data,
        ],
      },
      layout: {
        fillColor: function (rowIndex: any, node: any, columnIndex: any) {
          return rowIndex % 2 === 0 ? "#CCCCCC" : null;
        },
      },
    },
  ];


  const docDefinition: any = {
    pageSize: "A4",
   pageMargins: [20, 70, 20, 40],

    header: [pdfTitle],
    content: [dataInfo],
  };
  pdfMake.createPdf(docDefinition).download(`Relatório de Entrada ${reverseDate(initialDate)} até ${reverseDate(finalDate)} `);
}
