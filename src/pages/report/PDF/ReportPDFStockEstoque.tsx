import pdfMake from "pdfmake/build/pdfmake";
import pdfVfsRaw from "../../../assets/pdf-vfs.json";
import {base64Image} from "../image"

const pdfVfs: any = pdfVfsRaw;


export function ReportPDFStockEstoque(products: any, category: string) {
  
pdfMake.vfs = pdfVfs.pdfMake.vfs;

  pdfMake.fonts = {
    Roboto: {
      normal: "Roboto-Regular.ttf",
      bold: "Roboto-Medium.ttf",
      italics: "Roboto-Italic.ttf",
      bolditalics: "Roboto-MediumItalic.ttf",
    },
  };

  const pdfTitle = [
    {
      image: base64Image,
      alignment: "center",
      width: 500,
      margin: [10, 10, 10, 10],
    },
  ];

  const data = products.map((item: any) => {
    return [
      { text: item.name, fontSize: 9, alignment: "center" },
      { text: item.quantity, fontSize: 9, alignment: "center" },
    ];
  });

  const dataInfo = [
    {
      table: {
        headerRows: 1,
        widths: ["*", "*"],
        alignment: "center",
        margin: [20, 20, 20, 20],

        body: [
          [
            { text: "Nome", style: "tableHeader", alignment: "center" },
            { text: "Quantidade", style: "tableHeader", alignment: "center" },
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
  pdfMake.createPdf(docDefinition).download(`Relatório de Estoque Uni ${category}`);
}
