import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
  public data: any = {};
  private user: any;
  showContent: boolean = false;

  public charts: {
    title: string;
    type: ChartType;
    data: any[][];
    columns?: string[];
    options: Record<string, any>;
  }[] = [];

  constructor(private dataService: DataService, private authService: AuthService, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.user = this.authService.isAuthenticated() && this.authService;
    console.log("this.user:", this.user);
    this.user = this.user.auth.currentUser;
    if (this.user) {
      this.showContent = true;
      console.log("Fetching data for user:", this.user.email);
      this.dataService.fetchDataForUser(this.user.email).subscribe(
        data => {
          if (data) {
            this.data = data;
            console.log("Data fetched:", this.data);
            this.initCharts(this.data);
            this.cdRef.detectChanges();
          }
        },
        error => {
          console.error("Error fetching data for user:", this.user.email, error);
        }
      );
    }
  }

  initCharts(data?: any) {
    this.charts = [
      this.getCategoryDistributionPieChart(data),
      this.getCumulativeTechnologyUsageChart(data),
      this.getSkillsByEmploymentTypeChart(data),
      this.getSkillsByTypeColumnChart(data),
    ];
  }

  private getCategoryDistributionPieChart(data: any) {
    const categoryData = data.skills.map((skill: any) => [skill.type, skill.list.length]);
    return {
      title: 'Skills Category Distribution',
      type: ChartType.PieChart,
      columns: ['Category', 'Count'],
      data: categoryData,
      options: {
        colors: ['#87A8A4', '#9FB5AF', '#B7C2BA', '#CFD0C5', '#E7DDD0'],
        fontSize: 16,
        pieHole: 0.4,
        legend: { position: 'bottom', alignment: 'left', textStyle: { color: '#ECEFF1', fontSize: '12' } }, // Light text for legend
        backgroundColor: '#424242'
      }
    };
  }



  private getSkillsByTypeColumnChart(data: any) {
    const columnData = data.skills.map((skill: any) => [skill.type, skill.list.length]);
    return {
      title: 'Skill Count by Type',
      type: ChartType.ColumnChart,
      columns: ['Category', 'Count'],
      color: '#ECEFF1',
      data: columnData,
      options: {
        colors: ['#87A8A4', '#9FB5AF', '#B7C2BA', '#CFD0C5', '#E7DDD0'],
        fontSize: 16,
        hAxis: { title: 'Skill Type', textStyle: { fontSize: 14, color: '#ECEFF1' }, titleTextStyle: { color: '#ECEFF1' } },
        vAxis: { title: 'Count', textStyle: { fontSize: 14, color: '#ECEFF1' }, titleTextStyle: { color: '#ECEFF1' } },
        backgroundColor: '#424242',
        legend: { position: 'bottom', alignment: 'left', textStyle: { color: '#ECEFF1' } },
        chartArea: {
          left: '30%', // Adjust as needed
          top: '10%',  // Adjust as needed
          width: '60%', // Adjust as needed
          height: '70%'  // Adjust as needed
        },
      }
    };
  }

  private getSkillsByEmploymentTypeChart(data: any) {
    let employmentSkills: any = {};

    data.employment.forEach((job: any) => {
      job.technologies.forEach((tech: string) => {
        if (employmentSkills[job.title]) {
          employmentSkills[job.title].push(tech);
        } else {
          employmentSkills[job.title] = [tech];
        }
      });
    });

    let skillData: any[] = [];
    for (let employment in employmentSkills) {
      skillData.push([employment, employmentSkills[employment].length]);
    }

    return {
      title: 'Skills by Employment Type',
      type: ChartType.BarChart,
      columns: ['Employment', 'Number of Skills'],
      data: skillData,
      options: {
        hAxis: { title: 'Number of Skills', textStyle: { fontSize: 14, color: '#ECEFF1' }, titleTextStyle: { color: '#ECEFF1' } },
        vAxis: { title: 'Employment Type', textStyle: { fontSize: 14, color: '#ECEFF1' }, titleTextStyle: { color: '#ECEFF1' } },
        colors: ['#87A8A4', '#9FB5AF', '#B7C2BA', '#CFD0C5', '#E7DDD0'],
        fontSize: 16,
        legend: { position: 'bottom', alignment: 'left', textStyle: { color: '#ECEFF1' } },
        backgroundColor: '#424242',
        chartArea: {
          left: '10%', // Adjust as needed
          top: '10%',  // Adjust as needed
          width: '80%', // Adjust as needed
          height: '70%'  // Adjust as needed
        },
      }
    };
  }

  private getCumulativeTechnologyUsageChart(data: any) {
    let techTimeline: any = {};
    let cumulativeTechCount: any = {};

    data.employment.forEach((job: any) => {
      let startYear = new Date(job.period.split(" to ")[0]).getFullYear();
      job.technologies.forEach((tech: string) => {
        if (techTimeline[startYear]) {
          techTimeline[startYear][tech] = (techTimeline[startYear][tech] || 0) + 1;
        } else {
          techTimeline[startYear] = { [tech]: 1 };
        }
      });
    });

    let timelineData: any[] = [['Year']];
    let uniqueTechs = [...new Set(data.employment.flatMap((job: any) => job.technologies as string[]))];
    (uniqueTechs as string[]).forEach((tech: string) => {
      timelineData[0].push(tech);
      cumulativeTechCount[tech] = 0;
    });

    let sortedYears = Object.keys(techTimeline).sort((a, b) => parseInt(a) - parseInt(b));

    sortedYears.forEach(year => {
      let yearData = [year];
      (uniqueTechs as string[]).forEach((tech: string) => {
        cumulativeTechCount[tech] += techTimeline[year][tech] || 0;
        yearData.push(cumulativeTechCount[tech]);
      });
      timelineData.push(yearData);
    });

    return {
      title: 'Cumulative Technology Usage Over Time',
      type: ChartType.ColumnChart,
      columns: timelineData[0],
      data: timelineData.slice(1),
      options: {
        isStacked: true,
        backgroundColor: '#424242',
        hAxis: {
          title: 'Year',
          textStyle: { fontSize: 16, color: '#E0E0E0' }, // Brighter text for better readability
          titleTextStyle: { color: '#ECEFF1', italic: false }  // Non-italic for clarity
        },
        vAxis: {
          title: 'Cumulative Frequency',
          textStyle: { fontSize: 16, color: '#E0E0E0' },
          titleTextStyle: { color: '#ECEFF1', italic: false }
        },
        colors: ['#87A8A4', '#9FB5AF', '#B7C2BA', '#CFD0C5', '#E7DDD0'],
        legend: {
          position: 'bottom',
          alignment: 'start', // Aligns legend to the top right
          textStyle: { color: '#ECEFF1' },
          maxLines: 3 // Ensures legend items are spread out vertically
        },
        chartArea: {
          left: '12%',
          top: '12%',
          width: '76%',
          height: '76%'
        }
      }
    };
  }


}
