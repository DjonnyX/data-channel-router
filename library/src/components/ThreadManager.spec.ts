import { Thread } from "./Thread";
import { ThreadManager } from "./ThreadManager";

describe('ThreadManager', () => {
    test('There should be 4 running threads at startup', () => {
        const threadManager = new ThreadManager({ maxThreads: 4 });
        for (let i = 0, l = 10; i < l; i++) {
            const thread = new Thread();
            threadManager.add(thread);
        }
        threadManager.run();
        expect(threadManager.threadsInWork).toBe(4);
    });

    test('The number of rejected threads must be 5', () => {
        const threadManager = new ThreadManager({ maxThreads: 2 }), totalThreads = 10;
        for (let i = 0, l = totalThreads; i < l; i++) {
            const isReject = i % 2 === 0, thread = new Thread({
                onStart: () => {
                    if (isReject) {
                        thread.reject();
                    } else {
                        thread.complete();
                    }
                },
            });
            threadManager.add(thread);
        }
        threadManager.run();
        expect(threadManager.rejectedThreads).toBe(5);
    });

    test('The number of completed threads must be 5', () => {
        const threadManager = new ThreadManager({ maxThreads: 2 }), totalThreads = 10;
        for (let i = 0, l = totalThreads; i < l; i++) {
            const isReject = i % 2 === 0, thread = new Thread({
                onStart: () => {
                    if (isReject) {
                        thread.reject();
                    } else {
                        thread.complete();
                    }
                },
            });
            threadManager.add(thread);
        }
        threadManager.run();
        expect(threadManager.rejectedThreads).toBe(5);
    });

    test('The number of finished threads must be 10', () => {
        const threadManager = new ThreadManager({ maxThreads: 2 }), totalThreads = 10;
        for (let i = 0, l = totalThreads; i < l; i++) {
            const thread = new Thread({
                onStart: () => {
                    thread.complete();
                },
            });
            threadManager.add(thread);
        }
        threadManager.run();
        expect(threadManager.finishedThreads).toBe(totalThreads);
    });
});