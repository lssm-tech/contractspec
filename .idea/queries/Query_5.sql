select b.internal_name, b.computed_internally, bc.internal_name
from biomarker b
         left join public.biomarker_category bc on b.category_id = bc.id
