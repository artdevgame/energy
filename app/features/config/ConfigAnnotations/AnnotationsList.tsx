import type { ConfigAnnotations } from "~/hooks/useConfig";
import { useAnnotationsConfig } from '~/hooks/useConfig';
import { sortObjectByKeys } from '~/libs/objectUtils';
import { Button } from '~/ui/Button';

export const AnnotationsList = () => {
  const { annotations, setAnnotations } = useAnnotationsConfig();

  const handleRemove = ({ date, index }: { date: string; index: number }) => {
    const annotationsForDate = annotations[date] ?? [];

    const filteredAnnotations = annotationsForDate
      .slice(0, index)
      .concat(annotationsForDate.slice(index + 1, annotationsForDate.length));

    setAnnotations({ ...annotations, [date]: filteredAnnotations });
  };

  if (!annotations) {
    return null;
  }

  const sortedAnnotations = sortObjectByKeys(
    annotations,
    true
  ) as ConfigAnnotations;

  return (
    <ul className="-my-5 divide-y divide-gray-200">
      {Object.entries(sortedAnnotations).map(
        ([date, annotationsForDate = []]) =>
          annotationsForDate.map((annotation, index) => (
            <li key={`${date}-${index}`} className="py-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">{date}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {annotation}
                  </p>
                </div>
                <div>
                  <Button
                    onClick={() => handleRemove({ date, index })}
                    type="button"
                    variant="outline"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </li>
          ))
      )}
    </ul>
  );
};
