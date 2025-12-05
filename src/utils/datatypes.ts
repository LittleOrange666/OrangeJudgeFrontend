export type YesNo = "yes" | "no";

export type RuleType = "icpc" | "ioi";

export type PretestType = "no" | "all" | "last";

export type PracticeType = "no" | "private" | "public";

export function yesNo(val: boolean): YesNo {
    return val ? "yes" : "no";
}

export interface ContestSummary {
    cid: string,
    name: string,
    start_time: number,
    end_time: number,
    status: string,
    can_virtual: boolean,
    can_register: boolean,
    is_registered: boolean,
    elapsed: number
}

export interface ProblemSummary {
    pid: string,
    name: string,
}

export interface SubmissionSummary {
    id: string,
    time: number,
    user_id: string,
    user_name: string,
    problem_id: string,
    problem_name: string,
    lang: string,
    result: string,
    can_see: boolean,
    can_rejudge: boolean
}

export interface Announcement {
    title: string,
    content: string,
    time: number,
}

export interface Question {
    id: number,
    title: string,
    content: string,
    time: number,
    author: string,
    answer: string,
}

export interface ContestDetail {
    cid: string,
    name: string,
    description: string,
    start_time: number,
    end_time: number,
    status: string,
    can_edit: boolean,
    can_see_problems: boolean,
    problems: ProblemSummary[],
    announcements: Announcement[],
    questions: Question[],
    is_registered: boolean,
    is_virtual_participant: boolean,
    elapsed: number,
    can_register: boolean,
    target: number,
}

export interface SampleTestcase {
    input: string,
    output: string,
}

export interface ProblemDetail {
    pid: string,
    title: string,
    statement: string,
    statement_html: string,
    langs: string[],
    samples: SampleTestcase[],
    default_code: { [key: string]: string },
    time_limit: number,
    memory_limit: number
}

export interface SubmissionDetail {
    lang: string,
    source_code: string,
    completed: boolean,
    ce_msg: string,
    result: any,
    input: string,
    output: string,
    error: string,
    pid: string,
    simple_result: string,
    cid: string,
    contest: string
}

export interface ContestProblemDetail {
    pid: string,
    internal_pid: string,
    name: string,
    description: string,
    allowed_languages: string[],
    contest_cid: string,
    contest_name: string,
    time_limit: number,
    memory_limit: number
    statement_html: string,
    samples: SampleTestcase[],
}

export interface ContestSettings {
    contest_title: string,
    start_time: number,
    elapsed_time: number,
    rule_type: RuleType,
    pretest_type: PretestType,
    practice_type: PracticeType,
    register_type: boolean,
    show_standing: boolean,
    show_contest: boolean,
    freeze_time: number,
    unfreeze_time: number,
    penalty: number
}

export interface StandingSubmission {
    user: string,
    pid: string,
    time: number,
    scores: { [group: string]: number },
    total_score: number,
    pretest: boolean,
    per: number
}

export interface ContestPeriod {
    start_time: number,
    judging: boolean,
    idx: number
}

export interface ContestStanding {
    submissions: StandingSubmission[],
    rule: RuleType,
    pids: string[],
    penalty: number,
    pers: ContestPeriod[],
    main_per: number,
    participants: string[],
    virtual_participants: { [user: string]: number },
}