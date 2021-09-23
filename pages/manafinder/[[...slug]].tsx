// Imports
import Layout from "@components/Layout"; // Layout wrapper
import styles from "@styles/pages/Home.module.scss"; // Styles
import Link from "next/link"
import { gql,useQuery } from '@apollo/client';
import { useCallback, useRef, useState } from 'react';
import { useRouter } from "next/router";

// Types
import type { ReactElement } from "react";

interface Mana {
  id: number;
  itemName: string;
  currentOwner: Wallet;
}

interface ManaData {
  manas: Mana[];
}

interface ManaVars {
  suffixId: number;
  inventoryId: number;
}

interface UnclaimedVars {
  suffixId: number;
}

interface Bag {
  id: number;
  manasClaimed: number;
  itemName: string;
  currentOwner: Wallet;
}

interface Wallet {
  id: string;
}

interface BagData {
  bags: Bag[];
}

const inventoryIds = [
  "weapon",
  "chest",
  "head",
  "waist",
  "foot",
  "hand",
  "neck",
  "ring"
  ]

export default function Home(): ReactElement {
  const router = useRouter();
  const slug = router.query.slug;
  //const [newId, setNewId] = useState(initialId);

  let suffixId = 0;
  let inventoryId = 0;
  if (slug) {
    suffixId = Number(slug[0]);
    inventoryId = Number(slug[1]);
  }

  console.log('Claimed: ' + suffixId + ' '+ inventoryId);
  const GET_CLAIMED_MANA = gql`
  query GetClaimedMana($suffixId: Int!, $inventoryId: Int!) {
    manas(where: {suffixId: $suffixId, inventoryId: $inventoryId, currentOwner_not_in:
        ["0x1884d71487bFD7f595061221801e783EFcD0BF6A",
         "0x9BbDA2777C8623D8894b21120bEd1fFf72B024f8",
         "0xb6b3EB3Ec30bD8979DF60D7F47b173a389310dd9",
         "0xc3e33B881AeA922BCE6df56bC2C6f0686A3A421A",
         "0xdcab536Df6Dd9Ad5D332180edF1ba1ec71669Ae2",
         "0x4cF7E239F5BC882e007D9790A7B49B4abDFeB510",
         "0x338AEf050Ac689246490AA75B691AC03FE0a81C8",
         "0xeA0a3aae1DdA17D0a17A488196801F59cA96854C",
         "0x1f5FE23574D5aEc1660A8c6B209135DA5723042f",
         "0xd431a116A7d0eca9371614D5652CDfFfb7c5B6Eb",
         "0x0780529F0EcfAc1048d2fAAe5007Fe62Ce318c79",
         "0xf935C944A8E03181ae3229774D4B93D7BBa816D4",
         "0xAba619A78032abCfE0346c1592835Df563BA3BFa",
         "0xe1E5072FC1fF1A419D17bF9B5C5b6Ddd12c19F08",
         "0x17498d27433849a510165Cc1Fc618582AC54229B",
         "0xb1deA25cB8B997913f86076B372AA75F06C53c99"]}) {
      id
      itemName
      currentOwner {
        id
      }
    }
  }
  `;
  const { loading:cLoading, data:cData } = useQuery<ManaData, ManaVars>(
    GET_CLAIMED_MANA,
    { variables: { suffixId: suffixId, inventoryId: inventoryId } }
  );

  let inventoryName = inventoryIds[inventoryId];
  let inventoryNameSuffix = inventoryIds[inventoryId] + "SuffixId";
  console.log('Unclaimed: ' + suffixId + ' '+ inventoryName+ ' '+ inventoryNameSuffix);
  const GET_UNCLAIMED_MANA = gql`
  query GetUnclaimedMana($suffixId: Int!) {
    bags(where: {manasClaimed: 0, ${inventoryNameSuffix}: $suffixId}) {
      id
      manasClaimed
      itemName: ${inventoryName}
      currentOwner {
        id
      }
    }
  }
  `;
  const { loading:ucLoading, data:ucData } = useQuery<BagData, UnclaimedVars>(
    GET_UNCLAIMED_MANA,
    { variables: { suffixId: suffixId } }
  );
  return (
    <Layout>
      <div>
        <div className={styles.home__cta}>
          {/* CTA title */}
          <h1>Mana Finder</h1>
          {/* CTA Description */}
          <p>
            The Genesis Project is a community of  builders, designers, mathematicians and storytellers on a mission to discover the origin story of the Loot universe.
            <br /><br />
            Whether by chance, inevitability or divine design, the data reveals a hidden scaffolding behind the game, hiding in plain sight — <b>within the seemingly random Loot bags, there is a clear and singular Order to the Loot Universe.</b>
            The Genesis Project seeks not to <i>create</i>, but to <b>discover</b> the origin story of Loot (for Adventurers).
            <br /><br />
            Join us on our quest to restore the original Orders of Loot and resurrect the Genesis Adventurers.
          </p>
        </div>
        <div className={styles.home__chapters}>

          <h2>Claimed Mana</h2>
          {cLoading ? (
          <p>Loading ...</p>
          ) : (
            <table>
            <thead>
              <tr>
                <th>Token ID</th>
                <th>Item Name</th>
                <th>Addresss</th>
              </tr>
            </thead>
            <tbody>
              {cData && cData.manas.map(mana => (
                <tr key={mana.id}>
                  <td>{mana.id}</td>
                  <td>{mana.itemName}</td>
                  <td>{mana.currentOwner.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
          <h2>Unclaimed Mana</h2>
          {ucLoading ? (
          <p>Loading ...</p>
          ) : (
            <table>
            <thead>
              <tr>
                <th>Token ID</th>
                <th>Item Name</th>
                <th>Addresss</th>
              </tr>
            </thead>
            <tbody>
              {ucData && ucData.bags.map(mana => (
                <tr key={mana.id}>
                  <td>{mana.id}</td>
                  <td>{mana.itemName}</td>
                  <td>{mana.currentOwner.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </Layout>
  );
}

// <div>
//   <input
//     placeholder="Suffix ID"
//     type = "text"
//
//   />
//   <input
//     placeholder="Inventory ID"
//     type = "text"
//
//   />
//   <button onClick={onClick}>Search</button>
// </div>