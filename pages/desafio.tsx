import React, { useState } from "react";
import Container from "~/components/ui/Container";
import type { GetStaticProps } from "next";
import graphQLClient from "../GraphQL/graphQLClient";
import { EXCHANGE_RATES } from "../GraphQL/queries";
import VariationUF from "~/components/uf/variation";
import TableUF from "~/components/uf/tableUf";

export const getStaticProps: GetStaticProps = async () => {
  const currentDateFilter = new Date().toISOString().split("T")[0];
  const variables = { first: 1, pairAt: currentDateFilter };
  const data = await graphQLClient.request(EXCHANGE_RATES, variables);

  const currentDate = new Date();

  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Sumamos 1 porque los meses van de 0 a 11
  const year = currentDate.getFullYear();

  // Formatear la fecha
  const formattedDate = `${day}-${month}-${year}`;
  return {
    props: { data, currentDate: formattedDate },
  };
};

export default function PagesChallenge({ data, currentDate }: any) {
  const [quantityUf, setQuantityUf] = useState(1);
  const valueUf = data.exchange_rates.edges[0].node.pair_numeric;
  return (
    <>
      <div className="bg-secondary h-5"></div>
      <Container>
        <div className="flex flex-col">
          <div className="flex mb-10 justify-center items-center gap-x-10">
            <div className="text-center">
              <h1 className="text-secondary text-4xl">
                Valor <span className="text-primary">UF</span>
              </h1>
            </div>
            <div className="self-end">
              <p>Fecha {currentDate} </p>
            </div>
          </div>

          <div className="flex w-3/4 self-center justify-center mb-10 border-t border-b">
            <div className="flex w-full px-2 md:px-4 py-5">
              <div className="w-1/3 text-center">
                <p className="text-primary">1 UF</p>
              </div>
              <div className="w-1/3 text-center">=</div>
              <div className="w-1/3 text-center">
                <p className="text-primary">{valueUf}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="rounded overflow-hidden shadow-lg p-10">
              <div className="grid grid-cols-1 gap-y-10">
                <div className="grid grid-cols-1">
                  <label className="mb-2">UF</label>
                  <input
                    type="number"
                    value={quantityUf}
                    onChange={(e) =>
                      setQuantityUf(parseInt(e.target.value, 10))
                    }
                    className="form-input px-4 py-3 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-1">
                  <label className="mb-2">Pesos</label>
                  <input
                    type="number"
                    value={(valueUf * quantityUf).toFixed(2)}
                    className="form-input px-4 py-3 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
          <VariationUF/>
          <TableUF/>
        </div>
      </Container>
    </>
  );
}
