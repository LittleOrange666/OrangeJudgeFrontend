export type StatementType = "md" | "latex"
export type ProgramType = "my" | "default"
export type TestcaseRule = "min" | "avg";
export type CodecheckerMode = "disabled" | "public" | "private";
export type GenType = "sol" | "gen";

export interface BackGroundAction{
    log: string;
    action_name: string;
}

export interface ProblemManageLoading{
    pid: string;
    background_action: BackGroundAction
}

export interface Testcase {
    in_file: string;
    out_file: string;
    group: string;
    uncompleted: boolean;
    sample: boolean;
    pretest: boolean;
    gen: boolean;
}

export interface Statement{
    main: string;
    input: string;
    output: string;
    scoring: string;
    interaction: string;
    note: string;
    full: string;
    type: StatementType;
}

export interface ProgramFile{
    name: string;
    type: string;
}

export interface ProgramPtr{
    type: ProgramType
    name: string
}

export interface ExecPtr{
    name: string;
    lang: string;
}

export interface TestcaseGroup{
    score: number;
    rule: TestcaseRule;
    dependency: string[];
}

export interface ManualSample{
    in_txt: string;
    out_txt: string;
}

export interface GenGroup{
    file1: string;
    file2: string;
    type: GenType;
    group: string;
    cmds: string[];
    status: string;
}

export interface ProblemVersion{
    description: string;
    time: number;
}

export interface ProblemManageData{
    name: string;
    timelimit: string;
    memorylimit: string;
    testcases: Testcase[];
    testcases_gen: Testcase[];
    users: string[];
    statement: Statement;
    files: ProgramFile[];
    checker_source: ProgramPtr;
    checker: ExecPtr;
    is_interact: boolean;
    groups: {[lang: string]: TestcaseGroup };
    interactor_source: string;
    interactor: ExecPtr;
    manual_samples: ManualSample[];
    codechecker_source: string;
    codechecker: ExecPtr;
    codechecker_mode: CodecheckerMode;
    languages: {[lang: string]: boolean };
    language_multipliers: {[lang: string]: number };
    public_testcase: boolean;
    public_checker: boolean;
    gen_groups: GenGroup[];
    runner_source: {[lang: string]: string };
    runner_enabled: boolean
    library: string[];
    versions: ProblemVersion[];
    top_score: number;
    ac_info: string;
    default_code: {[lang: string]: string };
}

export interface ProblemManageVersion{
    date: number;
    message: string;
    id: string
}

export interface ProblemManageDetail{
    pid: string;
    name: string;
    is_public: boolean;
    data: ProblemManageData;
    versions: ProblemManageVersion[];
    public_files: string[];
    default_checkers: string[];
    available_languages: string[];
    default_interactors: string[];
    collaborators: string[];
    current_actions: string[];
    background_action: null;
}

export type ProblemManageInfo = ProblemManageDetail | ProblemManageLoading