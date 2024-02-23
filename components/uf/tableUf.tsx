import React, { useState, useEffect } from "react";
import graphQLClient from "../../GraphQL/graphQLClient";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  EXCHANGE_RATES,
  EXCHANGE_RATES_MONTH,
  getUf,
  getUfArray,
} from "~/GraphQL/queries";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  Exchange_RatesEdge,
  Query,
  QueryExchange_RatesCollectionArgs,
} from "~/utils/types";

export default function TableUF({}: any) {
  const [dataUf, setDataUf] = useState<any>(null);
  const [cursor, setCursor] = useState<string | null>("");
  const [historicalUFDate, setHistoricalUFDate] = useState<Date>(new Date());
  const [historicalUFValue, setHistoricalUFValue] = useState<number>(0);
  const handleChangePeriod = async (nextPeriod: boolean) => {
    let variables: QueryExchange_RatesCollectionArgs;
    if (cursor) {
      if (!nextPeriod) variables = { first: 10, after: cursor };
      else variables = { last: 10, before: cursor };
    } else {
      variables = { first: 10 };
    }

    try {
      const data: Query = await graphQLClient.request(
        EXCHANGE_RATES_MONTH,
        variables
      );
      const arrayUf = getUfArray(data);
      setDataUf(arrayUf);
      if (arrayUf) {
        const lastEdge = arrayUf[arrayUf.length - 1];
        if (lastEdge) {
          setCursor(lastEdge.cursor);
        } else {
          setCursor(null);
        }
      }
    } catch (error) {
      console.error("Error al obtener los datos de la API GraphQL:", error);
    }
  };

  const handleUFDay = async (date: Date) => {
    const variables = { first: 1, pairAt: date };
    const data = await graphQLClient.request(EXCHANGE_RATES, variables);
    setHistoricalUFDate(date as Date);
    const dataToValidate = getUf(data as Query);
    if (dataToValidate) setHistoricalUFValue(dataToValidate);
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
          <DatePicker onChange={(date) => handleUFDay(date as Date)} />
        </LocalizationProvider>
        <div>
         {historicalUFValue !== 0 && <><p>Valor UF: ${historicalUFValue.toLocaleString()} </p> <p>{historicalUFDate.toISOString().split("T")[0]}</p></> }

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
              <th className="text-left p-2">Valor UF</th>
            </tr>
          </thead>
          <tbody>
            {dataUf &&
              dataUf?.map((value: Exchange_RatesEdge, index: number) => {
                return (
                  <tr
                    className={index % 2 === 0 ? "bg-bgContainer" : ""}
                    key={index}
                  >
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
