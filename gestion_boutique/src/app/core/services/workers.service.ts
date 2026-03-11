import { Injectable, signal, computed } from '@angular/core';
import { FirestoreService } from './firebase/firestore.service';
import { AuthService } from './firebase/auth.service';
import { Worker, Task, Payment } from '../models/worker.model';
import { where, orderBy } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class WorkersService {
  private workers = signal<Worker[]>([]);
  public workers$ = computed(() => this.workers());

  constructor(
    private firestore: FirestoreService,
    private auth: AuthService
  ) {}

  async loadWorkers(): Promise<void> {
    const userId = this.auth.currentUser()?.uid;
    if (!userId) return;

    const workers = await this.firestore.getCollection<Worker>(
      'workers',
      where('userId', '==', userId),
      where('isActive', '==', true),
      orderBy('lastName', 'asc')
    );
    this.workers.set(workers);
  }

  async getWorker(workerId: string): Promise<Worker | null> {
    const worker = await this.firestore.getDocument<Worker>('workers', workerId);
    const userId = this.auth.currentUser()?.uid;
    if (worker && worker.userId !== userId) {
      return null;
    }
    return worker;
  }

  async createWorker(worker: Omit<Worker, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<string> {
    const userId = this.auth.currentUser()?.uid;
    if (!userId) throw new Error('User not authenticated');

    const workerData: Omit<Worker, 'id'> = {
      ...worker,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const workerId = await this.firestore.createDocument<Worker>('workers', workerData);
    await this.loadWorkers();
    return workerId;
  }

  async updateWorker(workerId: string, updates: Partial<Worker>): Promise<void> {
    await this.firestore.updateDocument<Worker>('workers', workerId, {
      ...updates,
      updatedAt: new Date()
    });
    await this.loadWorkers();
  }

  async deleteWorker(workerId: string): Promise<void> {
    await this.updateWorker(workerId, { isActive: false });
  }

  // Tasks management
  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<string> {
    const userId = this.auth.currentUser()?.uid;
    if (!userId) throw new Error('User not authenticated');

    const taskData: Omit<Task, 'id'> = {
      ...task,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return await this.firestore.createDocument<Task>('tasks', taskData);
  }

  async getTasks(workerId?: string): Promise<Task[]> {
    const userId = this.auth.currentUser()?.uid;
    if (!userId) return [];

    const constraints: any[] = [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    ];
    
    if (workerId) {
      constraints.push(where('workerId', '==', workerId));
    }

    return await this.firestore.getCollection<Task>('tasks', ...constraints);
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    await this.firestore.updateDocument<Task>('tasks', taskId, {
      ...updates,
      updatedAt: new Date()
    });
  }

  // Payments management
  async createPayment(payment: Omit<Payment, 'id' | 'createdAt' | 'userId'>): Promise<string> {
    const userId = this.auth.currentUser()?.uid;
    if (!userId) throw new Error('User not authenticated');

    const paymentData: Omit<Payment, 'id'> = {
      ...payment,
      userId,
      createdAt: new Date()
    };

    return await this.firestore.createDocument<Payment>('payments', paymentData);
  }

  async getPayments(workerId?: string): Promise<Payment[]> {
    const userId = this.auth.currentUser()?.uid;
    if (!userId) return [];

    const constraints: any[] = [
      where('userId', '==', userId),
      orderBy('paymentDate', 'desc')
    ];
    
    if (workerId) {
      constraints.push(where('workerId', '==', workerId));
    }

    return await this.firestore.getCollection<Payment>('payments', ...constraints);
  }

  async getWorkerPayments(workerId: string, startDate?: Date, endDate?: Date): Promise<Payment[]> {
    // Implementation pour filtrer par période
    const payments = await this.getPayments(workerId);
    
    if (startDate && endDate) {
      return payments.filter(p => 
        p.paymentDate >= startDate && p.paymentDate <= endDate
      );
    }
    
    return payments;
  }
}
