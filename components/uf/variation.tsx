import React, { useEffect, useState } from "react";
import graphQLClient from "../../GraphQL/graphQLClient";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { EXCHANGE_RATES, getUf, getUfPairAt } from "~/GraphQL/queries";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ItemUf from "./itemUf";
import { Query } from "~/utils/types";
import dayjs, { Dayjs } from "dayjs";

export default function VariationUF() {
  const [initDate, setInitDate] = useState<Dayjs>(dayjs());
  const [initDateFormated, setInitDateFormated] = useState<string | undefined>(
    ""
  );
  const [endDateFormated, setEndDateFormated] = useState<string | undefined>(
    ""
  );
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const [variation, setVariation] = useState<number | null>(null);
  const [valueUfInitDate, setValueUfInitDate] = useState<number>(0);
  const [valueUfEndDate, setValueUfEndDate] = useState<number>(0);
  const [minDate, setMinDate] = useState<Date | number>(0);
  const [maxDate, setMaxDate] = useState<Date | number>(0);

  const handleCalculate = async () => {
    const initDateFormated = initDate.toISOString().split("T")[0];
    const endDateFormated = endDate.toISOString().split("T")[0];
    setInitDateFormated(initDateFormated);
    setEndDateFormated(endDateFormated);
    const variablesInitDate = { first: 1, pairAt: initDateFormated };
    const variablesEndDate = { first: 1, pairAt: endDateFormated };

    const dataInit = await graphQLClient.request(
      EXCHANGE_RATES,
      variablesInitDate
    );
    const dataEnd = await graphQLClient.request(
      EXCHANGE_RATES,
      variablesEndDate
    );

    const valueUfInit = getUf(dataInit as Query);
    const valueUfEnd = getUf(dataEnd as Query);
    if (valueUfInit && valueUfEnd) {
      setValueUfInitDate(valueUfInit);
      setValueUfEndDate(valueUfEnd);
      const variacionPorcentual =
        ((valueUfEnd - valueUfInit) / valueUfInit) * 100;

      setVariation(variacionPorcentual);
    }
  };

  const styles = {
    largeIcon: {
      width: 60,
      height: 60,
      color: "#F59E0B",
    },
  };

  const getFirstAndLastUf = async () => {
    const dataFirst = await graphQLClient.request(EXCHANGE_RATES, { first: 1 });
    const dataLast = await graphQLClient.request(EXCHANGE_RATES, { last: 1 });
    const dateMin = getUfPairAt(dataLast as Query);
    const dateMax = getUfPairAt(dataFirst as Query);
    if (dateMin && dateMax) {
      setMinDate(new Date(dateMin));
      setMaxDate(new Date(dateMax));
    }
  };

  useEffect(() => {
    getFirstAndLastUf();
  }, []);

  return (
    <>
      <div className="flex mb-5 justify-center items-center gap-x-10 mt-10">
        <div className="text-center">
          <h1 className="text-secondary text-4xl">
            Variación <span className="text-primary">UF</span>
          </h1>
        </div>
      </div>
      <div className="flex mb-10 justify-center items-center">
        <div className="text-center">
          <p>
            El Valor de la Unidad de Fomento (UF) se reajusta diariamente según
            la variación del IPC del mes anterior. En términos simples se
            reajusta con la inflación. Puedes calcular la variación para ver las
            decisiones que pudiste haber tomado, pero más importante, las
            decisiones que puedes tomar a futuro.
          </p>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-2 gap-x-5">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              minDate={dayjs(minDate)}
              maxDate={endDate}
              onChange={(date) => setInitDate(date as Dayjs)}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              maxDate={dayjs(maxDate)}
              minDate={initDate}
              onChange={(date) => setEndDate(date as Dayjs)}
            />
          </LocalizationProvider>
        </div>
      </div>
      <div className="flex self-center mt-10">
        <button
          className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleCalculate()}
        >
          Calcular
        </button>
      </div>
      {variation && (
        <div
          className="bg-primary px-4 py-3 rounded relative bg-opacity-15 mt-10 text-center mb-10"
          role="alert"
        >
          <p>La UF ha variado un {variation.toFixed(2)}% </p>
        </div>
      )}
      {variation && (
        <div>
          <p>
            A continuación te mostramos algunos ejemplos para que te des cuenta
            como varía el dinero en distintos ámbitos.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 mt-10">
            <div className="rounded overflow-hidden shadow-lg p-10">
              <ItemUf
                icon={<ApartmentIcon style={styles.largeIcon} />}
                title={"Propiedad"}
              />
              <p className="mt-5">
                Un departamento que costaba 2000 UF al {initDateFormated}{" "}
                tendría un valor de ${(valueUfInitDate * 2000).toLocaleString()}
                .
              </p>
              <p>
                {" "}
                El mismo departamento al {endDateFormated} tendría un valor de $
                {(valueUfEndDate * 2000).toLocaleString()}.
              </p>
            </div>
            <div className="rounded overflow-hidden shadow-lg p-10">
              <ItemUf
                icon={<AccountBalanceWalletIcon style={styles.largeIcon} />}
                title={"Cuenta Bancaria"}
              />
              <p className="mt-5">
                Una cuenta bancaria en UF con $100.000 al {initDateFormated}, el
                día {endDateFormated} tendría $
                {((variation / 100) * 100000 + 100000).toLocaleString()}. Si
                hubieras tenido tu dinero en una cuenta normal no tendrías ese
                saldo a favor.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
