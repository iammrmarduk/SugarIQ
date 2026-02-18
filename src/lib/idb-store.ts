// idb-store.ts — IndexedDB persistence for Factory V2 datasets
import type { R7106ExtendedRecord, DataChecksum } from './r7106-extended'

const DB_NAME = 'sugariq-factory-v2'
const DB_VERSION = 1
const STORE_NAME = 'datasets'

export interface StoredDataset {
  id?: number
  fileName: string
  uploadedAt: number // timestamp
  records: R7106ExtendedRecord[]
  checksum: DataChecksum
  format?: 'v1' | 'v2'
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveDataset(
  fileName: string,
  records: R7106ExtendedRecord[],
  checksum: DataChecksum,
  format: 'v1' | 'v2' = 'v2',
): Promise<number> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)

    const entry: StoredDataset = {
      fileName,
      uploadedAt: Date.now(),
      records,
      checksum,
      format,
    }

    const request = store.add(entry)
    request.onsuccess = () => resolve(request.result as number)
    request.onerror = () => reject(request.error)
    tx.oncomplete = () => db.close()
  })
}

export async function loadLatestDataset(): Promise<StoredDataset | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.openCursor(null, 'prev') // latest first by auto-increment key

    request.onsuccess = () => {
      const cursor = request.result
      if (cursor) {
        resolve(cursor.value as StoredDataset)
      } else {
        resolve(null)
      }
    }
    request.onerror = () => reject(request.error)
    tx.oncomplete = () => db.close()
  })
}

export async function listDatasets(): Promise<Pick<StoredDataset, 'id' | 'fileName' | 'uploadedAt'>[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.openCursor(null, 'prev')
    const results: Pick<StoredDataset, 'id' | 'fileName' | 'uploadedAt'>[] = []

    request.onsuccess = () => {
      const cursor = request.result
      if (cursor) {
        const { id, fileName, uploadedAt } = cursor.value as StoredDataset
        results.push({ id, fileName, uploadedAt })
        cursor.continue()
      } else {
        resolve(results)
      }
    }
    request.onerror = () => reject(request.error)
    tx.oncomplete = () => db.close()
  })
}

export async function loadDataset(id: number): Promise<StoredDataset | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.get(id)

    request.onsuccess = () => resolve((request.result as StoredDataset) ?? null)
    request.onerror = () => reject(request.error)
    tx.oncomplete = () => db.close()
  })
}

export async function deleteDataset(id: number): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.delete(id)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
    tx.oncomplete = () => db.close()
  })
}

export async function clearAllDatasets(): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.clear()

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
    tx.oncomplete = () => db.close()
  })
}
