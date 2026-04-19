import { ArrowRight, Building2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter, Badge, Button } from '../../../components/ui';
import { ProjectIdeaHighlight } from './ProjectIdeaHighlight';

/**
 * Job card component displaying job details and project idea
 */
const JobCard = ({ job }) => {
  const { id, job_title, company, location, analysis } = job;
  const { tech_stack, core_problem, project_idea } = analysis;

  return (
    <Card hover className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {job_title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {location}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {tech_stack.map((tech) => (
            <Badge key={tech} variant="primary">
              {tech}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Core Problem
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {core_problem}
          </p>
        </div>

        <ProjectIdeaHighlight idea={project_idea} />
      </CardContent>

      <CardFooter>
        <Link to={`/jobs/${id}`}>
          <Button variant="secondary" size="sm">
            View Details
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export { JobCard };
