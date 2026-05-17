import { CrisisPacket } from '../../types';

export class SyncEngine {
  private static STORAGE_KEY = 'signalpack_offline_queue';

  /**
   * Pushes a packet to the offline queue
   */
  static async enqueuePacket(packet: CrisisPacket): Promise<void> {
    const queue = this.getQueue();
    queue.push({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      packet
    });
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(queue));
  }

  /**
   * Tries to flush the queue when online
   */
  static async flushQueue(syncFn: (packet: CrisisPacket) => Promise<void>): Promise<void> {
    if (!navigator.onLine) return;

    const queue = this.getQueue();
    if (queue.length === 0) return;

    const remaining = [];
    for (const item of queue) {
      try {
        await syncFn(item.packet);
      } catch (error) {
        console.error('Sync failed for packet:', item.id, error);
        remaining.push(item);
      }
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(remaining));
  }

  static getQueue(): Array<{id: string, timestamp: number, packet: CrisisPacket}> {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }
}
