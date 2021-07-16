type EntityId = string;

interface Arrow {
    id: EntityId;
    location: number;
    color: string;
    directionDegrees: number;
}

interface StateJson {
    arrows: {
        [id: string]: Add<Arrow>;
    };
}

type Add<T> = Omit<T, "id">;
type Update<T> = Partial<Add<T>>;

/**
 * Core of the game keeps track of the state
 * Allows reading of the state and updates of the state.
 * Decides what types of updates are legal
 */
class Core {
    private ids: Set<EntityId> = new Set<EntityId>();

    private addId(id: EntityId) {
        if (this.ids.has(id)) {
            throw new Error(`Duplicate id [${id}]`);
        }

        this.ids.add(id);
    }

    private randomId(): EntityId {
        const size = 9;
        const id = Math.floor(Math.random() * Math.pow(10, size))
            .toString()
            .padStart(size + 1, "0");
        return id;
    }

    private createId(): EntityId {
        let id = this.randomId();
        while (this.ids.has(id)) {
            id = this.randomId();
        }

        return id;
    }

    // Keep track of all the arrows
    private arrows: Map<EntityId, Arrow> = new Map<EntityId, Arrow>();

    constructor() {}

    saveJson(): string {
        const arrows = Array.from(this.arrows.values());
        const state = {
            arrows,
        };
        return JSON.stringify(state);
    }

    loadJson(stateJson: string): void {
        const state: StateJson = JSON.parse(stateJson);

        Object.getOwnPropertyNames(state.arrows).forEach((id: string) => {
            const arrow = state.arrows[id];
            // ids need to be persisted so they can be internally referenced within the state
            this.addArrow(id, arrow);
        });
    }

    getArrowsAtIndex(index: number): readonly Arrow[] {
        return Array.from(this.arrows.values()).filter(
            (x) => x.location === index
        );
    }

    private addArrow(id: EntityId, add: Add<Arrow>) {
        this.addId(id);

        const arrow = {
            id,
            ...add,
        };

        this.arrows.set(id, arrow);
    }

    createArrow(add: Add<Arrow>) {
        const id = this.createId();
        this.addArrow(id, add);
    }

    updateArrow(id: EntityId, update: Update<Arrow>): void {
        const arrow = this.arrows.get(id);
        if (arrow === undefined) {
            throw new Error("Invalid Arrow Id");
        }
        const updated = { ...arrow, ...update };
        this.arrows.set(arrow.id, updated);
    }
}
