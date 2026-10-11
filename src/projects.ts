export type Project={id:string;title:string;summary:string;stack:string[];role:string;github?:string;details:string[]};
export const projects:Project[]=[
{id:'smartbudget',title:'SmartBudget — 스마트 가계부',summary:'가계부 거래·월별 예산·리포트 API를 구현하는 팀 프로젝트',stack:['Python','API','pytest'],role:'백엔드 API 및 테스트',github:'https://github.com/yu-morph/smartbudget-server',details:['거래 API 및 테스트 작성','월별 예산 API 및 테스트 작성','Pull Request를 통한 팀 협업']},
{id:'papertrading',title:'모의매매 프로그램',summary:'미국·한국 주식 모의매매 프로그램 개발 프로젝트',stack:['Python','Alpaca Paper Trading','GUI'],role:'개인 개발',github:'https://github.com/BaekJaeYeol/paper-trading-program',details:['모의계좌 기반 거래 인터페이스 개발','자산과 주문 상태를 표시하는 GUI 구성']}];
