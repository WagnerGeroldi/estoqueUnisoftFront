import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

export function ReportPDFStockZero(products: any) {
  const fonts: any = pdfFonts;
  
    const vfs =
      fonts.pdfMake?.vfs ??
      fonts.default?.pdfMake?.vfs ??
      fonts.default?.vfs ??
      fonts.vfs;
  
    if (!vfs) {
      throw new Error("VFS do pdfmake não foi carregado.");
    }
  
    pdfMake.vfs = vfs;

  const pdfTitle = [
    {
      text: "Relatório De Estoque Zerado",
      fontSize: 16,
      bold: true,
      alignment: "center",
      margin: [10, 10, 10, 15],
    },
  ];

  const data =  products.map((item: any) => {
    return [
        { text: item.name, fontSize: 9,   alignment: "center", },
            { text: item.quantity, fontSize: 9,   alignment: "center", },
            { text: item.categoryProduct, fontSize: 9,   alignment: "center", },
    ]
  })

  const dataInfo = [
    {
      table: {
        headerRows: 1,
        widths: ["*", "*", "*"],

        body: [
          [
            { text: "Nome", style: "tableHeader", alignment: "center" },
            { text: "Quantidade", style: "tableHeader", alignment: "center" },
            { text: "Categoria", style: "tableHeader", alignment: "center" },
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

  const footerInfo = [
    {
      text: "Unisoft Informática",
      fontSize: 12,
      bold: true,
      alignment: "center",
      margin: [10, 10, 10, 10],
    },
  ];

  const docDefinition: any = {
    pageSize: "A4",
    pageMargins: [20, 40, 20, 40],

    header: [pdfTitle],
    content: [dataInfo],
    footer: [footerInfo],
  };
  pdfMake.createPdf(docDefinition).download("Relatório_Estoque_Zero");
}
