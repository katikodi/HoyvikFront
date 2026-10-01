using Fallout.Common;
using Fallout.Common.Tooling;

class Build : FalloutBuild
{
	public static int Main() => Execute<Build>(x => x.Frontend);

	[Parameter("Configuration to build - Default is 'Debug' (local) or 'Release' (server)")]
	readonly Configuration Configuration = IsLocalBuild ? Configuration.Debug : Configuration.Release;

	Target Clean => _ => _
		.Before(Restore)
		.Executes(() =>
		{
		});

	Target Restore => _ => _
		.Executes(() =>
		{
		});


	Target Publish => _ => _
		.DependsOn(Frontend)
		.Executes(() =>
		{
			ProcessTasks
				.StartProcess("aspire", "publish", RootDirectory / "backend" / "HoyvikProject.AppHost")
			.AssertZeroExitCode();
		});

	//Target Deploy => _ => _
	//	.DependsOn(Publish)
	//	.Executes(() =>
	//	{
	//		ProcessTasks.StartProcess(
	//			"aspire",
	//			"deploy --non-interactive",
	//			RootDirectory / "backend" / "HoyvikProject.AppHost")
	//		.AssertZeroExitCode();
	//	});

	Target Frontend => _ => _
		.Executes(() =>
		{
			ProcessTasks
				.StartProcess("npm", "--prefix ./frontend run build", RootDirectory)
				.AssertZeroExitCode();
		});

	Target Compile => _ => _
		.DependsOn(Restore)
		.Executes(() =>
		{
		});

}
