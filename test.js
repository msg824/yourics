class HashTable {
    // 기본 buckets size
    constructor(size) {
        this.buckets = new Array(size) 
        this.size = size

        console.log(this.buckets)
        // console.log(this.size)
    } 

    // 해시 함수
    hash(key) { 
        console.log(key.toString().length % this.size)
        return key.toString().length % this.size; 
    } 
    
    // 해시 테이블에 새로운 데이터를 추가한다. 
    set(key, value) { 
        // console.log(key, value)

        let index = this.hash(key); 
        // console.log(this.buckets[index])

        if (!this.buckets[index]) { 
            this.buckets[index] = []; 
        } 

        this.buckets[index].push([key, value]) 
    } 
    
    // key를 이용하여 데이터를 가져 온다. 
    get(key) { 
        
        let index = this.hash(key); 
        
        if (!this.buckets[index]) return null 
        // for of loop로 key와 일치하는 값 찾아내기 
        for (let bucket of this.buckets[index]) {
            if (bucket[0] === key) {
                return bucket[1] 
            } 
        } 
    } 
} 

const hashTable = new HashTable(10) 

hashTable.set('userid1', 'example') 
hashTable.set('userid2', 'say') 
hashTable.set('userid3', 'other') 
// hashTable.set('userid4', 'sara') 
// hashTable.set('userid5', 'one') 

// hashTable.get('userid1') 
// hashTable.get('userid2') 
// hashTable.get('userid3')
// hashTable.get('userid4') 
// hashTable.get('userid5')

// console.log(hashTable.buckets)