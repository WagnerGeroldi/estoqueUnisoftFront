import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

export function ReportGeneral(products: any[]) {

  pdfMake.vfs = pdfFonts.pdfMake.vfs;
   

  // Ordena os produtos alfabeticamente pelo grupo (categoryProduct)
  const sortedProducts = [...products].sort((a, b) => {
    // Compara os grupos em ordem alfabética (considerando maiúsculas/minúsculas e acentos)
    const groupCompare = a.categoryProduct.localeCompare(b.categoryProduct, 'pt-BR', { sensitivity: 'base' });
    
    // Se o grupo for o opcionalmente igual, ordena secundariamente pelo nome do produto
    if (groupCompare === 0) {
      return a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' });
    }
    
    return groupCompare;
  });

  const pdfTitle = [
    {
      text: "Relatório Geral do Estoque",
      fontSize: 16,
      bold: true,
      alignment: "center",
      margin: [10, 10, 10, 15],
    },
  ];

  // Mapeia os produtos já ordenados
  const data = sortedProducts.map((item: any) => {
    return [
      { text: item.categoryProduct, fontSize: 9, alignment: "left" },
      { text: item.name, fontSize: 9, alignment: "left" },
      { text: item.quantity, fontSize: 9, alignment: "center" },
      { text: item.fornecedor, fontSize: 9, alignment: "center" },
      { text: item.estoque, fontSize: 9, alignment: "center" },
    ];
  });

  const dataInfo = [
    {
      table: {
        headerRows: 1,
        widths: [75, 159, 75, 103, 75],
        body: [
          [
            { text: "Grupo", style: "tableHeader", alignment: "center" },
            { text: "Nome", style: "tableHeader", alignment: "center" },
            { text: "Quantidade", style: "tableHeader", alignment: "center" },
            { text: "Fornecedor", style: "tableHeader", alignment: "center" },
            { text: "Estoque", style: "tableHeader", alignment: "center" },
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
    pageMargins: [20, 40, 20, 40],
    header: [pdfTitle],
    content: [dataInfo],
  };
  
  pdfMake.createPdf(docDefinition).download("Relatório_Geral");
}