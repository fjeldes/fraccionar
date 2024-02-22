import React, { useState, useEffect } from "react";
import graphQLClient from "../../GraphQL/graphQLClient";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { EXCHANGE_RATES, EXCHANGE_RATES_MONTH } from "~/GraphQL/queries";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

export default function TableUF({}: any) {
  const [dataUf, setDataUf] = useState<any>(null);
  const [cursor, setCursor] = useState<string>("");
  const [historicalUFDate, setHistoricalUFDate] = useState<Date>(new Date());
  const [historicalUFValue, setHistoricalUFValue] = useState<number>(0);
  const handleChangePeriod = async (nextPeriod: boolean) => {
    let variables;
    if (cursor) {
      if (!nextPeriod) variables = { first: 10, after: cursor };
      else variables = { last: 10, before: cursor };
    } else {
      variables = { first: 10 };
    }

    try {
      const data = await graphQLClient.request(EXCHANGE_RATES_MONTH, variables);
      console.log(data.exchange_rates.edges);
      setDataUf(data.exchange_rates.edges);

      // Verifica si hay un cursor en la última arista para establecerlo como nuevo cursor
      const lastEdge =
        data.exchange_rates.edges[data.exchange_rates.edges.length - 1];
      if (lastEdge) {
        setCursor(lastEdge.cursor);
      } else {
        setCursor(null); // Si no hay cursor disponible, lo establecemos como null
      }
    } catch (error) {
      console.error("Error al obtener los datos de la API GraphQL:", error);
      // Manejar el error de alguna manera apropiada
    }
  };

  const handleUFDay = async (date: Date) => {
    const variables = { pairAt: date };
    const data = await graphQLClient.request(EXCHANGE_RATES, variables);
    setHistoricalUFDate(date as Date);
    setHistoricalUFValue(data.exchange_rates.edges[0].node.pair_numeric);
  };

  useEffect(() => {
    handleChangePeriod(false);
  }, []);

  return (
    <div className="mt-10">
      <div>
        <p className="text-secondary text-4xl">
          <span className="text-primary">UF</span> Histórico
        </p>
      </div>
      <div className="grid grid-cols-2 gap-x-5 mt-5 mb-5">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker onChange={(date) => handleUFDay(date)} />
          </LocalizationProvider>
          <div>
            <p>Valor Uf: {historicalUFValue} </p>
            <p>{historicalUFDate.toISOString().split("T")[0]}</p>
          </div>
        </div>
      <div className="flex justify-between mb-2">
        <button
          className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleChangePeriod(false)}
        >
          <ChevronLeftIcon />
        </button>
        <div>
            <p className="text-2xl">Tabla Histórica</p>
        </div>
        <button
          className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleChangePeriod(true)}
        >
          <ChevronRightIcon />
        </button>
      </div>
      <div className="border border-primary rounded">
        <table className="rounded overflow-hidden shadow-lg border-2 border-primary w-full">
          <thead>
            <tr>
              <th className="text-left p-2">Dia</th>
              <th className="text-left p-2">Valor Uf</th>
            </tr>
          </thead>
          <tbody>
            {dataUf &&
              dataUf?.map((value, index) => {
                return (
                  <tr className={index % 2 === 0 ? "bg-bgContainer" : ""}>
                    <td className="p-2">{value.node.pair_at}</td>
                    <td>{value.node.pair_numeric}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
