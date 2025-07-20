export interface State {
  stateMachine: StateMachine;
  name: string;
  onEnter?: (...args: unknown[]) => void;
  onUpdate?: () => void;
}

export class StateMachine {
  private currentState?: State;
  private readonly states = new Map<string, State>();
  private readonly stateQueue: { state: string; args: unknown[] }[] = [];
  private isChangingState = false;

  constructor(private readonly id: string = crypto.randomUUID()) {}

  get currentStateName(): string | undefined {
    return this.currentState?.name;
  }

  public update(): void {
    this.processQueuedState();
    this.currentState?.onUpdate?.();
  }

  public addState(state: State): void {
    state.stateMachine = this;
    this.states.set(state.name, state);
  }

  public changeState(name: string, ...args: unknown[]): void {
    if (!this.states.has(name)) {
      console.log(`[${this.id}] Unknown state: ${name}`);
      return;
    }

    if (this.isCurrentState(name)) return;

    if (this.isChangingState) {
      this.queueState(name, args);
      return;
    }

    this.isChangingState = true;

    console.log(`[${this.id}] Switching from '${this.currentState?.name ?? 'none'}' to '${name}'`);
    this.currentState = this.states.get(name);
    this.currentState?.onEnter?.(...args);

    this.isChangingState = false;
  }

  private processQueuedState(): void {
    const queued = this.stateQueue.shift();
    if (queued) {
      this.changeState(queued.state, ...queued.args);
    }
  }

  private queueState(name: string, args: unknown[]): void {
    this.stateQueue.push({ state: name, args });
  }

  private isCurrentState(name: string): boolean {
    return this.currentState?.name === name;
  }
}
