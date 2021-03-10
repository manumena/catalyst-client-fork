import { getMainnetCatalysts, getRopstenCatalysts } from 'dcl-catalyst-commons'
import fs from 'fs'

async function main(): Promise<void> {
  const mainnet = await getMainnetCatalysts()
  const ropsten = await getRopstenCatalysts()

  const mergedList = { mainnet, ropsten }

  const listString = JSON.stringify(mergedList, null, 4)
  const fileText = `// This file is autogenerated, do not edit manually\nexport = (\n${listString}\n)`

  await fs.promises.writeFile('src/CatalystsList.ts', Buffer.from(fileText))
}

console.log('Updating catalyst list')
main()
  .then(() => console.log('Catalyst list updated'))
  .catch((error) => console.error('Failed to update the catalyst list', error))
