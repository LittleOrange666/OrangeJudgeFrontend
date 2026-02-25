import {ContestPeriod, ContestStanding} from "@/utils/datatypes";

export interface Line {
    first: string;
    last: string[];
}

export interface StandingDisplay {
    headLine: string[];
    content: Line[];
}

type userType = "main" | "virtual" | "practice"

interface IOIUser {
    total_score: number;
    last_update: number;
    type: userType;
    scores: { [pid: string]: { [group: string]: number } };
    user?: string;
}

interface ICPCResult {
    score: number;
    penalty_cnt: number;
    cnt: number;
    penalty: number;
}

interface ICPCUser {
    total_score: number;
    penalty: number;
    type: userType;
    scores: { [pid: string]: ICPCResult };
    user?: string;
}

function IOIcmp(a: IOIUser, b: IOIUser): number {
    const pa = a.type === "practice";
    const pb = b.type === "practice";
    if (pa != pb) return +pa - (+pb);
    const sa = a.total_score;
    const sb = b.total_score;
    if (sa != sb) return sb - sa;
    return a.last_update - b.last_update;
}

function ICPCcmp(a: ICPCUser, b: ICPCUser): number {
    const pa = a.type === "practice";
    const pb = b.type === "practice";
    if (pa != pb) return +pa - (+pb);
    const sa = a.total_score;
    const sb = b.total_score;
    if (sa != sb) return sb - sa;
    return a.penalty - b.penalty;
}

export function resolveIOI(data: ContestStanding, officialOnly: boolean): StandingDisplay {
    const perTable: { [idx: number]: ContestPeriod } = {};
    for (const pre of data.pers) {
        perTable[pre.idx] = pre;
    }
    const out: { [user: string]: IOIUser } = {};
    const headLine: string[] = [];
    const content: Line[] = [];

    headLine.push("User");
    headLine.push("Score");
    for (const pid of data.pids) {
        headLine.push(pid);
    }
    headLine.push("Time");

    for (const user in data.virtual_participants) {
        const key = user + ":" + data.virtual_participants[user];
        out[key] = {
            total_score: 0,
            last_update: 0,
            type: "virtual",
            scores: {}
        }
        for (const pid of data.pids) out[key].scores[pid] = {}
    }

    for (const user of data.participants) {
        const key = user + ":" + data.main_per;
        out[key] = {
            total_score: 0,
            last_update: 0,
            type: "main",
            scores: {}
        }
        for (const pid of data.pids) out[key].scores[pid] = {}
    }

    for (const obj of data.submissions) {
        const key = obj.user + ":" + obj.per;
        if (!(key in out)) {
            out[key] = {
                total_score: 0,
                last_update: 0,
                type: "practice",
                scores: {}
            }
            for (const pid of data.pids) out[key].scores[pid] = {}
        }
        for (const group in obj.scores) {
            out[key].scores[obj.pid][group] = Math.max(out[key].scores[obj.pid][group] || 0, obj.scores[group]);
        }
        let tot = 0;
        for (const pid of data.pids) {
            for (const group in out[key].scores[pid]) {
                tot += out[key].scores[pid][group];
            }
        }
        if (tot > out[key].total_score) {
            out[key].total_score = tot;
            out[key].last_update = obj.time - (out[key].type === "practice" ? 0 : perTable[obj.per].start_time);
        }
    }
    const arr: IOIUser[] = [];
    for (const user in out) {
        const obj = out[user];
        obj.user = user;
        arr.push(obj);
    }
    arr.sort(IOIcmp);
    let cur_rank = 1;
    for (const obj of arr) {
        if (officialOnly && obj.type !== "main") continue;
        const key = obj.user;
        const username = key.substring(0, key.lastIndexOf(":"));
        let rank = "";
        if (obj.type === "main") {
            rank = "" + cur_rank;
            cur_rank++;
        } else if (obj.type === "practice") {
            rank = "*"
        }
        const res: string[] = [];
        res.push(username);
        res.push("" + obj.total_score);
        for (const pid of data.pids) {
            let cur = 0;
            for (const group in obj.scores[pid]) {
                cur += obj.scores[pid][group];
            }
            res.push("" + cur);
        }
        content.push({
            first: rank,
            last: res
        })
    }
    return {headLine: headLine, content: content};
}

export function resolveICPC(data: ContestStanding, officialOnly: boolean): StandingDisplay {
    const perTable: { [idx: number]: ContestPeriod } = {};
    for (const pre of data.pers) {
        perTable[pre.idx] = pre;
    }
    const out: { [user: string]: ICPCUser } = {};
    const headLine: string[] = [];
    const content: Line[] = [];

    headLine.push("User");
    headLine.push("Score");
    headLine.push("Penalty");
    for (const pid of data.pids) {
        headLine.push(pid);
    }

    for (const user in data.virtual_participants) {
        const key = user + ":" + data.virtual_participants[user];
        out[key] = {
            total_score: 0,
            penalty: 0,
            type: "virtual",
            scores: {}
        }
        for (const pid of data.pids) out[key].scores[pid] = {score: 0, penalty_cnt: 0, cnt: 0, penalty: 0}
    }

    for (const user of data.participants) {
        const key = user + ":" + data.main_per;
        out[key] = {
            total_score: 0,
            penalty: 0,
            type: "main",
            scores: {}
        }
        for (const pid of data.pids) out[key].scores[pid] = {score: 0, penalty_cnt: 0, cnt: 0, penalty: 0}
    }

    for (const obj of data.submissions) {
        const key = obj.user + ":" + obj.per;
        if (!(key in out)) {
            out[key] = {
                total_score: 0,
                penalty: 0,
                type: "practice",
                scores: {}
            }
            for (const pid of data.pids) out[key].scores[pid] = {score: 0, penalty_cnt: 0, cnt: 0, penalty: 0}
        }
        let start_time = perTable[data.main_per].start_time;
        if (obj.per && (obj.per in perTable)) {
            start_time = perTable[obj.per].start_time;
        }
        const cur_time = Math.floor((obj.time - start_time) / 60);
        const cur = out[key].scores[obj.pid];
        if (obj.total_score > cur.score) {
            cur.score = obj.total_score;
            cur.penalty_cnt = cur.cnt;
            cur.penalty = cur_time + cur.penalty_cnt * data.penalty;
        }
        cur.cnt = cur.cnt + 1;
        let tot = 0;
        let tot_p = 0;
        for (const pid of data.pids) {
            tot += out[key].scores[pid].score;
            tot_p = out[key].scores[pid].penalty;
        }
        out[key].total_score = tot;
        out[key].penalty = tot_p;
    }
    const arr: ICPCUser[] = [];
    for (const user in out) {
        const obj = out[user];
        obj.user = user;
        arr.push(obj);
    }
    arr.sort(ICPCcmp);
    let cur_rank = 1;
    for (const obj of arr) {
        if (officialOnly && obj.type !== "main") continue;
        const key = obj.user;
        const username = key.substring(0, key.lastIndexOf(":"));
        const penalty = obj.type === "practice" ? 0 : obj.penalty;
        let rank = "";
        const res: string[] = [];
        if (obj.type === "main") {
            rank = "" + cur_rank;
            cur_rank++;
        } else if (obj.type === "practice") {
            rank = "*"
        }
        res.push(username);
        res.push("" + obj.total_score);
        res.push("" + penalty);
        for (const pid of data.pids) {
            const cur = obj.scores[pid];
            let line = "" + cur.score;
            if (obj.type !== "practice") {
                line += "/" + (cur.penalty - data.penalty * cur.penalty_cnt) + "+" + cur.penalty_cnt;
            }
            res.push(line);
        }
        content.push({
            first: rank,
            last: res
        })
    }

    return {headLine: headLine, content: content};
}