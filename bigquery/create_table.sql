CREATE TABLE `health.child_welfare_indicators` (
  case_id STRING,
  timestamp TIMESTAMP,
  child STRUCT<
    name STRING,
    age INT64,
    situation STRING
  >,
  positive_indicators ARRAY<STRUCT<
    category STRING,
    description STRING,
    impact_score FLOAT64
  >>,
  negative_indicators ARRAY<STRUCT<
    category STRING,
    description STRING,
    severity_score FLOAT64
  >>,
  overall_prognosis STRUCT<
    score FLOAT64,
    assessment STRING
  >
);
