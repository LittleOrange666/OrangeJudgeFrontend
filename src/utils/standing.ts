import {ContestPeriod, ContestStanding} from "@/utils/datatypes";

/**
 * Represents a line in the standings display.
 */
export interface Line {
    /** The first column value (e.g., rank). */
    first: string;
    /** The remaining column values. */
    last: string[];
}

/**
 * Represents the structure of the standings display.
 */
export interface StandingDisplay {
    /** The header line of the standings table. */
    headLine: string[];
    /** The content lines of the standings table. */
    content: Line[];
}

/**
 * Represents the type of user in the contest.
 * - "main": Main participant.
 * - "virtual": Virtual participant.
 * - "practice": Practice participant.
 */
type userType = "main" | "virtual" | "practice";

/**
 * Represents the structure of an IOI user in the standings.
 */
interface IOIUser {
    /** The total score of the user. */
    total_score: number;
    /** The last update time of the user's score. */
    last_update: number;
    /** The type of the user. */
    type: userType;
    /** The scores of the user for each problem and group. */
    scores: { [pid: string]: { [group: string]: number } };
    /** The username of the user (optional). */
    user?: string;
}

/**
 * Represents the result structure for an ICPC problem.
 */
interface ICPCResult {
    /** The score for the problem. */
    score: number;
    /** The penalty count for the problem. */
    penalty_cnt: number;
    /** The number of submissions for the problem. */
    cnt: number;
    /** The penalty time for the problem. */
    penalty: number;
}

/**
 * Represents the structure of an ICPC user in the standings.
 */
interface ICPCUser {
    /** The total score of the user. */
    total_score: number;
    /** The total penalty time of the user. */
    penalty: number;
    /** The type of the user. */
    type: userType;
    /** The scores of the user for each problem. */
    scores: { [pid: string]: ICPCResult };
    /** The username of the user (optional). */
    user?: string;
}

/**
 * Compares two IOI users for sorting.
 * @param {IOIUser} a - The first user.
 * @param {IOIUser} b - The second user.
 * @returns {number} The comparison result.
 */
function IOIcmp(a: IOIUser, b: IOIUser): number {
    const pa = a.type === "practice";
    const pb = b.type === "practice";
    if (pa != pb) return +pa - (+pb);
    const sa = a.total_score;
    const sb = b.total_score;
    if (sa != sb) return sb - sa;
    return a.last_update - b.last_update;
}

/**
 * Compares two ICPC users for sorting.
 * @param {ICPCUser} a - The first user.
 * @param {ICPCUser} b - The second user.
 * @returns {number} The comparison result.
 */
function ICPCcmp(a: ICPCUser, b: ICPCUser): number {
    const pa = a.type === "practice";
    const pb = b.type === "practice";
    if (pa != pb) return +pa - (+pb);
    const sa = a.total_score;
    const sb = b.total_score;
    if (sa != sb) return sb - sa;
    return a.penalty - b.penalty;
}

/**
 * Resolves the IOI standings from the contest data.
 * @param {ContestStanding} data - The contest standing data.
 * @param {boolean} officialOnly - Whether to include only official participants.
 * @returns {StandingDisplay} The resolved standings display.
 */
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
        res.push(data.display_names[username] || username);
        res.push("" + obj.total_score);
        for (const pid of data.pids) {
            let cur = 0;
            for (const group in obj.scores[pid]) {
                cur += obj.scores[pid][group];
            }
            res.push("" + cur);
        }
        if (obj.type === "practice") res.push("");
        else res.push("" + (obj.last_update / 60).toFixed(2));
        content.push({
            first: rank,
            last: res
        })
    }
    return {headLine: headLine, content: content};
}

/**
 * Resolves the ICPC standings from the contest data.
 * @param {ContestStanding} data - The contest standing data.
 * @param {boolean} officialOnly - Whether to include only official participants.
 * @returns {StandingDisplay} The resolved standings display.
 */
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
        res.push(data.display_names[username] || username);
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
        res.push("" + penalty);
        content.push({
            first: rank,
            last: res
        })
    }

    return {headLine: headLine, content: content};
}