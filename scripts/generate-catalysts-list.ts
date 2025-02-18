import { getAllCatalystFromProvider } from '@dcl/catalyst-contracts'
import { HTTPProvider, bytesToHex } from 'eth-connect'
import 'isomorphic-fetch'
import fs from 'fs'

async function main(): Promise<void> {
  const mainnet = await getAllCatalystFromProvider(new HTTPProvider('https://rpc.decentraland.org/mainnet?project=ci'))
  const ropsten = await getAllCatalystFromProvider(new HTTPProvider('https://rpc.decentraland.org/ropsten?project=ci'))

  const mergedList = {
    mainnet: mainnet.map($ => {
      return {
        address: $.domain,
        owner: $.owner,
        id: '0x' + bytesToHex($.id)
      }
    }), ropsten: ropsten.map($ => {
      return {
        address: $.domain,
        owner: $.owner,
        id: '0x' + bytesToHex($.id)
      }
    })
  }

  const listString = JSON.stringify(mergedList, null, 4)
  const fileText = `// This file is autogenerated, do not edit manually\nexport = (\n${listString}\n)`

  await fs.promises.writeFile('src/CatalystsList.ts', Buffer.from(fileText))
}

console.log('Updating catalyst list')
main()
  .then(() => console.log('Catalyst list updated'))
  .catch((error) => console.error('Failed to update the catalyst list', error))
