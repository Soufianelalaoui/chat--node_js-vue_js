<?php

namespace App\Entity;

use App\Repository\ReportRepository;
use DateTimeInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ReportRepository::class)
 */
class Report
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="reports")
     * @ORM\JoinColumn(nullable=false)
     */
    private $reporterUser;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="reportsGot")
     * @ORM\JoinColumn(nullable=false)
     */
    private $reportedUser;

    /**
     * @ORM\Column(type="date")
     */
    private $reportDate;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getReportDate(): ?DateTimeInterface
    {
        return $this->reportDate;
    }

    public function setReportDate(DateTimeInterface $reportDate): self
    {
        $this->reportDate = $reportDate;

        return $this;
    }

    public function getReporterUser(): ?User
    {
        return $this->reporterUser;
    }

    public function setReporterUser(?User $reporterUser): self
    {
        $this->reporterUser = $reporterUser;

        return $this;
    }

    public function getReportedUser(): ?User
    {
        return $this->reportedUser;
    }

    public function setReportedUser(?User $reportedUser): self
    {
        $this->reportedUser = $reportedUser;

        return $this;
    }
}
