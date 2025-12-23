-- Group biomarker data by requisitionUuid and create a JSON array for each
SELECT
    req.uuid AS requisition_uuid,
    json_agg(
            json_build_object(
                    'biomarker_id', br.biomarker_id,
                    'biomarker_operator', br.operator,
                    'biomarker_value', br.value,
                    'operator', CASE
                                    WHEN br.operator = 'EQUAL' THEN '='
                                    WHEN br.operator = 'GREATER_THAN' THEN '>'
                                    WHEN br.operator = 'LESS_THAN' THEN '<'
                                    WHEN br.operator = 'GREATER_THAN_OR_EQUAL' THEN '>='
                                    WHEN br.operator = 'LESS_THAN_OR_EQUAL' THEN '<='
                                    ELSE '=' -- Default to equal if null
                        END
            )
    ) AS biomarker_data
FROM
    "biomarker_result" br
        JOIN
    "visit" v ON br.visit_id = v.id
        JOIN
    "requisition" req ON v.requisition_id = req.id
WHERE
    br.operator IS NOT NULL
  AND br.biomarker_id != 1 -- ignore bio age and recompute
  AND req.uuid = '176ef911-6824-41f0-bca2-f2ce290eec11'
GROUP BY
    req.uuid
ORDER BY
    req.uuid
LIMIT 10;