interface GraphData {
  name: string;
  total: number;
}

export const getGraphRevenue = async (
  storeId: string
): Promise<GraphData[]> => {
  const monthlyRevenue: { [key: number]: number } = {};

  // Converting the grouped data into the format expected by the graph
  const graphData: GraphData[] = [
    { name: "Jan", total: 20 },
    { name: "Feb", total: 40 },
    { name: "Mar", total: 50 },
    { name: "Apr", total: 23 },
    { name: "May", total: 63 },
    { name: "Jun", total: 35 },
    { name: "Jul", total: 14 },
    { name: "Aug", total: 87 },
    { name: "Sep", total: 54 },
    { name: "Oct", total: 34 },
    { name: "Nov", total: 32 },
    { name: "Dec", total: 43 },
  ];

  // Filling in the revenue data
  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
  }

  return graphData;
};
