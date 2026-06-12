// CPU bound блокирует поток потому что вызов функции countCPU не использует libuv, 
// там используется только сам nodeJs который сам по себе является однопоточным, event loop блокируется синхронным выполнением внутри V8.
// а вызывая I/O задачи, подключается уже libuv, который реализует многопоточность, поэтому он ничего не блокирует.
// setTimeout срабатывает после countCPU потому что countCPU задача как раз таки блокирует выполнение колбека setTimeout внутри event loop
//  и приходится ждать пока countCPU не закончится

const fs = require('fs');
const path = require('path');
const files = path.join(__dirname, 'files');
function countCPU(){
    console.time('CPU-bound')
    let sum = 0
    for (let i = 1; i <= 1000000000;i++){
        sum+=i
    }
    console.timeEnd('CPU-bound')
    return sum
}


async function IO(){
    console.time('I/O-bound')

  const reads = []
  for (let i = 1; i <= 10; i++) {
    const filePath = path.join(files, `file${i}.txt`)
    reads.push(fs.promises.readFile(filePath, 'utf-8'))
  }

  const results = await Promise.all(reads)

  console.timeEnd('I/O-bound')
  return results
}

setTimeout(() => console.log('I should fire in 100ms'), 100)
countCPU()
IO()
